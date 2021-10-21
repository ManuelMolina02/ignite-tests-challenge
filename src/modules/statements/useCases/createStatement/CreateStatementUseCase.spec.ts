import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";

import { CreateStatementUseCase } from "./CreateStatementUseCase";


let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;


const userFake = {
    name: 'name test',
    email: 'emailtest@email.com',
    password: '123456'
}

describe('Create Statement', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
        
    })

    it('should be able to create a new deposit', async () => {
        const user = await inMemoryUsersRepository.create(userFake)

        const depositStatement: ICreateStatementDTO = {
            user_id: user.id as string,
            description: 'description statement',
            amount: 150,
            type: OperationType.DEPOSIT
        }

        const deposit = await createStatementUseCase.execute(depositStatement)

        expect(deposit).toHaveProperty('id')
        expect(deposit.type).toEqual('deposit')
    })

    it('should be able to create a new deposit', async () => {
        const user = await inMemoryUsersRepository.create(userFake)

        const depositStatement: ICreateStatementDTO = {
            user_id: user.id as string,
            description: 'description statement',
            amount: 150,
            type: OperationType.DEPOSIT
        }

        await createStatementUseCase.execute(depositStatement)

        const withdrawStatement: ICreateStatementDTO = {
            user_id: user.id as string,
            description: 'description statement',
            amount: 150,
            type: OperationType.WITHDRAW
        }

        const withdraw = await createStatementUseCase.execute(withdrawStatement);

        expect(withdraw).toHaveProperty('id')
        expect(withdraw.type).toEqual('withdraw')

    })

    it('should not be able to create a new deposit a user not existent', async () => {
        expect(async () => {

            const depositStatement: ICreateStatementDTO = {
                user_id: 'userFake',
                description: 'description statement fake',
                amount: 150,
                type: OperationType.DEPOSIT
            }

            await createStatementUseCase.execute(depositStatement)
        }).rejects.toEqual(new AppError('User not found', 404))

    })

    it('should not be able to make a withdrawal if the balance is insufficient', async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create(userFake)

            const depositStatement: ICreateStatementDTO = {
                user_id: user.id as string,
                description: 'description statement',
                amount: 150,
                type: OperationType.DEPOSIT
            }

            await createStatementUseCase.execute(depositStatement)

            const withdrawStatement: ICreateStatementDTO = {
                user_id: user.id as string,
                description: 'description statement',
                amount: 250,
                type: OperationType.WITHDRAW
            }
    
            await createStatementUseCase.execute(withdrawStatement);
            
        }).rejects.toEqual(new AppError('Insufficient funds', 400))

    })
})



