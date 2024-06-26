import styled from 'styled-components/native'

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    background-color: ${({theme}) => theme.COLORS.GRAY_600};
    align-items: center;`

    export const LoadIndicator = styled.ActivityIndicator.attrs(({theme}) => ({
        color: theme.COLORS.GREEN_700
    }))`

    `