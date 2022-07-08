import User from './src/data/userModel';
import dotenv from 'dotenv';

const result = dotenv.config()

if (result.error) {
    throw result.error;
}

const createMockData = () => {
    var user = new User({ email:'test@example.com', password:'password12'});
    user.save();
};

const resetDatabase = async () => {
    await User.deleteMany({});
}

export { createMockData, resetDatabase };