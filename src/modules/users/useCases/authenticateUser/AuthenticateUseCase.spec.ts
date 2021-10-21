import { AppError } from "../../../../shared/errors/AppError";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

const userFake: ICreateUserDTO = {
    name: 'name test',
    email: 'emailtest@email.com',
    password: '123456'
}

describe('Authenticate User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })

    it('should be able an authenticate an user', async () => {

        await createUserUseCase.execute(userFake)

        const result = await authenticateUserUseCase.execute({
            email: userFake.email,
            password: userFake.password,
        })

        expect(result).toHaveProperty('token');
    })

    it('should not be able to authenticate an none existent user', async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: 'user.email',
                password: 'kakaka',
            }),
        ).rejects.toEqual(new AppError('Incorrect email or password', 401));
    })

    it('should not be able to authenticate with incorrect password', async () => {
        expect(async () => {

            await createUserUseCase.execute(userFake)

            await authenticateUserUseCase.execute({
                email: userFake.email,
                password: '1234',
            })
        }).rejects.toEqual(new AppError('Incorrect email or password', 401))
    })

});