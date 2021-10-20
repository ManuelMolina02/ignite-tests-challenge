import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AppError } from '../../../../shared/errors/AppError'
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe('Authenticate User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })

    it('should be able an authenticate an user', async () => {
        const user: ICreateUserDTO = {
            name: 'name test',
            email: 'emailtest@email.com',
            password: '123456'
        }

        await createUserUseCase.execute(user)

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        })

        expect(result).toHaveProperty('token');
    })

    it('should not be able to authenticate an none existent user', async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: 'user.email',
                password: 'kakaka',
            }),
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to authenticate with incorrect password', async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'name test',
                email: 'emailtest@email.com',
                password: '123456'
            }

            await createUserUseCase.execute(user)

            await authenticateUserUseCase.execute({
                email: user.email,
                password: '1234',
            })
        }).rejects.toBeInstanceOf(AppError)
    })


});