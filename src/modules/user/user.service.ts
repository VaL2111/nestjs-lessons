import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/modules/user/models/user.model";
import * as bcrypt from "bcrypt";
import { CreateUserDTO } from "src/modules/user/dto";
import { AuthUserResponse } from "../auth/response";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    dto.password = await this.hashPassword(dto.password);
    await this.userRepository.create({
      firstName: dto.firstName,
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });
    return dto;
  }

  async publicUser(email: string): Promise<Omit<AuthUserResponse, "token"> | null> {
    return this.userRepository.findOne({
      where: { email: email },
      attributes: { exclude: ["password"] },
    });
  }
}
