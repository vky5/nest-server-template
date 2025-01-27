import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { describe, beforeEach, it, expect } from "@jest/globals";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

let service: AuthService;
let fakeUserService: Partial<UsersService>;
let db: User[] = [];

describe("AuthService", () => {
  beforeEach(async () => {
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = db.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        db.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService); // Assigning the service instance
  });

  it("can create an instance of AuthService", () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with salted and hashed password", async () => {
    const user = await service.signup("fahsldkjfa@fajklsd.com", "asdf");

    // go through all the things that happens in your signup function
    // check if the user already exist but since the promise is returning empty array there wont be any issue in find method
    // check if the password is properly hashed and salt is attached to hash

    expect(user.password).not.toEqual("asdf");

    const [salt, hash] = user.password.split(".");

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("checks the error given if the email already exists", async () => {
    await service.signup("fjlaskdf@fjlaks.com", "fjalksdf"); // since it is already in db it will throw an error

    await expect(
      service.signup("fjlaskdf@fjlaks.com", "fjalksdf"),
    ).rejects.toThrow(BadRequestException);
  });

  it("Throws an error if the user doesnt exist during sigin process", async () => {
    await expect(service.signin("fjalsd@asf.com", "fjasdk")).rejects.toThrow(
      NotFoundException,
    );
  });

  it("Checks if the password is invalid", async () => {
    await service.signup("fajslkdf@fjl.com", "correct password"); // correct way to check it now
    await expect(
      service.signin("fajslkdf@fjl.com", "wrong password"),
    ).rejects.toThrow(BadRequestException);
  });

  it("checks the sigin process if the user already exists", async () => {
    await service.signup("asdf@jkl.com", "passwd");

    const user = await service.signin("asdf@jkl.com", "passwd");
    expect(user).toBeDefined();
  });
});
