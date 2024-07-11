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
    },
})
export default theme;
