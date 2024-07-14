import { Container, Divider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {

    return (
        <main>
            <Container maxW='xl'>
                
                <Header/>
                <Outlet/>

            </Container>
        </main>
    );
}

export default MainLayout;