import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

const userFake = {
    name: "user test",
    email: "test@test.com",
    password: "123456",
}

describe("Show User Profile", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(
            userRepositoryInMemory
        );
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
    });

    it("Should be able return user profile", async () => {

        const user = await createUserUseCase.execute(userFake);

        await showUserProfileUseCase.execute(user.id as string);
    });

    it("Should not be able to return profile inexistent user", async () => {
        expect(async () => {
            const user = await createUserUseCase.execute(userFake);

            await showUserProfileUseCase.execute(`error+${user.id as string}`);

        }).rejects.toEqual(new AppError('User not found', 404))
    });
});
