import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";

import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;


const userFake = {
    name: 'name test',
    email: 'emailtest@email.com',
    password: '123456'
}

describe("Get Statment Operation", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
    });

    it('should be able to get details for a operation', async () => {
        const user = await inMemoryUsersRepository.create(userFake)

        const depositStatement = await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            description: 'description statement',
            amount: 150,
            type: OperationType.DEPOSIT
        })

        const statement = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: depositStatement.id as string,
        })

        expect(statement).toHaveProperty('id')
        expect(statement.type).toEqual('deposit')
        expect(statement.amount).toEqual(150)
    })



    it('should not be able to get details for a operation user does not exists', async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create(userFake)

            const depositStatement = await inMemoryStatementsRepository.create({
                user_id: user.id as string,
                description: 'description statement',
                amount: 150,
                type: OperationType.DEPOSIT
            })
    
            await getStatementOperationUseCase.execute({
                user_id: 'userFake',
                statement_id: depositStatement.id as string,
            })
        }).rejects.toEqual(new AppError('User not found', 404));
    })


    it('should not be able to get details for a operation statement does not exists', async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create(userFake)
    
            await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: 'statementFake',
            })
        }).rejects.toEqual(new AppError('Statement not found', 404));
    })

})