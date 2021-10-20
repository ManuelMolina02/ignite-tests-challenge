import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserUseCase} from './CreateUserUseCase'
import {AppError} from '../../../../shared/errors/AppError'

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


const userFake = {
    name: 'name test',
    email: 'emailtest@email.com',
    password: '123456'
}

describe('Create User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it('should be able to create a new user', async () => {
        const user = await createUserUseCase.execute(userFake)
        expect(user).toHaveProperty('id')

    })


    it('should not be able to create a user with exists email', async () => {
        await createUserUseCase.execute(userFake)

        await expect(
            createUserUseCase.execute(userFake)
        ).rejects.toEqual(new AppError('User already exists'))
    })
})