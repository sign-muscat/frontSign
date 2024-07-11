import { extendTheme } from '@chakra-ui/react'

// 프로토 타입에 적용한 Blue Gray 컬러 임의로 추가
const theme = extendTheme({
    colors: {
        blueGray: {
            50: '#ECEFF1',
            100: '#CFD8DC',
            200: '#B0BEC5',
            300: '#90A4AE',
            400: '#78909C',
            500: '#607D8B',
            600: '#546E7A',
            700: '#455A64',
            800: '#37474F',
            900: '#263238',
        },

        amber: {
            50: '#FFF8E1',
            100: '#FFECB3',
            200: '#FFE082',
            300: '#FFD54F',
            400: '#FFCA28',
            500: '#FFC107',
            600: '#FFB300',
            700: '#FFA000',
            800: '#FF8F00',
            900: '#FF6F00',
            A100: '#FFE57F',
            A200: '#FFD740',
            A300: '#FFC400',
            A400: '#FFAB00',
        },
    },
    components: {
        Button: {
            variants : {
                amber: {
                    bg: "amber.300",
                    color: "black",
                    _hover : {
                        bg: "amber.500",
                        color: "black",
                    }
                },
                gray: {
                    bg: "blueGray.50",
                    color: "black",
                    _hover: {
                        bg: "blueGray.100",
                        color: "black",
                    }
                }
            }
        },
    }
})
export default theme;
