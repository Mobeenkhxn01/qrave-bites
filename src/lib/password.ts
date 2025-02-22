import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function saltAndHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}