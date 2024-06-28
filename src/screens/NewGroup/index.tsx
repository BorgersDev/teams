import { useState } from "react";
import { Alert, ScrollView, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AppError } from "@utils/appError";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

import { groupCreate } from "@storage/group/groupCreate";


import { Container, Content, Icon } from "./styles";

export const NewGroup = () => {
    const [ group, setGroup] = useState('')

    const navigation = useNavigation();

    const handleNew = async () => {
        try {
            if (group.trim().length === 0) {
                return Alert.alert('Novo grupo', 'Informe o nome da turma.')
            }
            
        await groupCreate(group)
        navigation.navigate('players', { group })
        } catch (error) {
            if(error instanceof AppError) {
                Alert.alert('Novo Grupo', error.message)
            } else {
                Alert.alert('Novo Grupo', 'Não foi possível criar um novo grupo')
            }
          console.log(error)
        }
    }

    return (
        <Container>
            <Header showBackButton />
                <Content>
                    <Icon />
                     <Highlight 
                            title="Nova Turma"
                         subtitle="crie a turma para adicionar as pessoas"
                     />
                     <Input 
                         placeholder="Nome da turma"
                         onChangeText={setGroup}
                     />
                      <Button 
                         title="Criar" 
                         style={{marginTop: 20}} 
                          onPress={handleNew}
                  />
               </Content>
        </Container>
    )
}