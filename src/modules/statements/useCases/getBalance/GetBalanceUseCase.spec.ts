import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

const userFake = {
    name: 'name test',
    email: 'emailtest@email.com',
    password: '123456'
}

describe("Get Balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository
        );
    });

    it("should be able return user balance", async () => {
        const user = await inMemoryUsersRepository.create(userFake);

        const balance = await getBalanceUseCase.execute({
            user_id: user.id as string,
        });

        expect(balance).toHaveProperty("balance");
    });

    it("should not be able return user balance what not existent", () => {
        expect(async () => {
            await getBalanceUseCase.execute({
                user_id: "userFake",
            });
        }).rejects.toEqual(new AppError('User not found', 404));
    });
});
