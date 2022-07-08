
import dotenv from 'dotenv';

const result = dotenv.config()

if (result.error) {
    throw result.error;
}

const createMockData = () => {
    
};

const resetDatabase = async () => {
    
}

export { createMockData, resetDatabase };