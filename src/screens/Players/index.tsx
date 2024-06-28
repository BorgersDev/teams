import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { AppError } from "@utils/appError";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";


import { addPlayerByGroup } from "@storage/player/addPlayerByGroup";
import { getPlayersByGroupAndTeams } from "@storage/player/getPlayerByGroupAndTeams";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { removePlayerByGroup } from "@storage/player/removePlayerByGroup";
import { removeGroupByName } from "@storage/group/removeGroupByName";



import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";


type RouteParams = {
    group: string;
}

export const Players = () => {
    const [ isLoading, setIsLoading] = useState(true)
    const [ newPlayerName, setNewPlayerName] = useState('')
    const [ team, setTeam] = useState('Time A')
    const [ players, setPlayers] = useState<PlayerStorageDTO[]>([])

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null)

    const handleAddPlayer = async () => {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert( 'Nova pessoa', 'Para adicionar uma pessoa informe o nome.')
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await addPlayerByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur();
            setNewPlayerName('')
            fetchPlayersByTeam();
        } catch (error) {
            if (error instanceof AppError){
                Alert.alert('Nova pessoa', error.message)
            } else {
                console.log(error)
                Alert.alert('Nova pessoa','Não foi possível adicionar')
            }
        }

    }

    const fetchPlayersByTeam = async () => {
        try {
            setIsLoading(true);
            const playersByTeam = await getPlayersByGroupAndTeams(group, team);
            setPlayers(playersByTeam)
        } catch (error) {
            console.log(error)
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado')
            throw (error)
        } finally {
            setIsLoading(false);
        }
    }

    const handleRemovePlayer = async (playerName: string) => {
        try {
          await removePlayerByGroup(playerName, group);
          fetchPlayersByTeam();

        } catch (error) {
            console.log(error)
            Alert.alert('Remover pessoa', 'Não foi possível remover a pessoa selecionada.')
        }
    }

    const removeGroup = async () => {
        try {
           await removeGroupByName(group);
           
           navigation.navigate('groups')
        } catch (error) {
            console.log(error);
            Alert.alert('Remover grupo', 'Não foi possível remover o grupo')
        }
    }
    
    const handleRemoveGroup = async () => {
        Alert.alert(
            'Remover turma', 
            'Deseja remover a turma?', 
            [
             {text: 'Não', style: 'cancel'},
             {text: 'Sim', onPress: () => removeGroup() }
            ],
            
        )
    }

    useEffect(() => {
        fetchPlayersByTeam();
    },[team]);

    return (
        <Container>
            <Header showBackButton />
            <Highlight
            title={group}
            subtitle="adicione a galera e separe os times"
            />
            <Form>
                <Input 
                   inputRef={newPlayerNameInputRef}
                   onChangeText={setNewPlayerName}
                   value={newPlayerName}
                   placeholder="Nome da pessoa"
                   autoCorrect={false}
                   onSubmitEditing={handleAddPlayer}
                   returnKeyType="done"
                />
                <ButtonIcon 
                    icon='add'
                    onPress={handleAddPlayer}

                />
            </Form> 
            <HeaderList>
                <FlatList 
                   data={['Time A', 'Time B']}
                   keyExtractor={item => item}
                  renderItem={({item}) => (
                     <Filter 
                        title={item}
                         isActive={item === team}
                         onPress={() => setTeam(item)}
                     />
                    )}
                  horizontal
                />
                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>
            
            
            {
                isLoading ? <Loading /> :
                <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({item}) => (
                    <PlayerCard 
                        name={item.name} 
                        onRemove={() => handleRemovePlayer(item.name)}
                    />
                )}
                ListEmptyComponent={() => <ListEmpty message='Não há pessoas nesse time' />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[{paddingBottom: 100},players.length === 0 && {flex: 1}]}
            />}
            <Button 
                title="Remover turma"
                type="SECONDARY"
                onPress={handleRemoveGroup}
            />
        </Container>
    )
}