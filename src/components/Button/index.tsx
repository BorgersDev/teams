import { TouchableOpacityProps } from "react-native";
import { Container, Title, ButtonTypeStyleProps } from "./styles";

type Props = {
    title: string;
    type?: ButtonTypeStyleProps;
}

export const Button = ({title, type = 'PRIMARY', ...rest }: Props) => {
    return (
        <Container type={type}  {...rest}>
            <Title>
                {title}
            </Title>
        </Container>
    )
}