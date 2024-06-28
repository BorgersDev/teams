import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION } from "@storage/storageConfig"
import { getAllGroups } from "./getAllGroups";
import { AppError } from "@utils/appError";

export const groupCreate = async (newGroup: string) => {
    try {
        const storedGroups = await getAllGroups();

        const groupAlreadyExists = storedGroups.includes(newGroup)
        
        if (groupAlreadyExists) {
            throw new AppError('Já existe um groupo cadastrado com esse nome');
        }
        const storage = JSON.stringify([...storedGroups, newGroup])
        await AsyncStorage.setItem(GROUP_COLLECTION, storage)
    } catch(error) {
        throw error;
    }
}