import { Container, Divider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {

    return (
        <main>
            <Container maxW='2xl' border='1px solid'>
                
                <Header/>
                <Divider mb={5}/>
                <Outlet/>

            </Container>
        </main>
    );
}

export default MainLayout;