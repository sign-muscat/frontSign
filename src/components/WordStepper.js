import {Flex, Step, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus} from "@chakra-ui/react";
import React from "react";

function WordStepper({questionNumber, posesPerQuestion, poseNumber}) {

    let paddingVertical;
    if (posesPerQuestion[questionNumber - 1] === 1 || posesPerQuestion[questionNumber - 1] >= 6) {
        paddingVertical = '0';
    } else if (posesPerQuestion[questionNumber - 1] === 2) {
        paddingVertical = '11rem';
    } else if (posesPerQuestion[questionNumber - 1] === 3) {
        paddingVertical = '8rem';
    } else if (posesPerQuestion[questionNumber - 1] === 4) {
        paddingVertical = '6rem';
    } else if (posesPerQuestion[questionNumber - 1] === 5) {
        paddingVertical = '4rem';
    }

    return (
        <Flex justifyContent="center" position="absolute" h="100%" right="-100px" top="0" py={paddingVertical}>
            <Stepper orientation='vertical' index={poseNumber - 1} gap="0" height='100%' justifyContent="center">
                {Array.from({length: posesPerQuestion[questionNumber - 1]}).map((_, index) => (
                    <Step key={index}>
                        <StepIndicator
                            sx={{
                                borderColor: "amber.300!important",
                                bg: index === poseNumber - 1 ? 'amber.300' : index < poseNumber - 1 ? ' amber.300!important' : 'white',
                                color: index === poseNumber - 1 ? 'white' : index < poseNumber - 1 ? 'white' : 'black'
                            }}
                        >
                            <StepStatus
                                complete={<StepIcon/>}
                                incomplete={<StepNumber/>}
                                active={<StepNumber/>}
                            />
                        </StepIndicator>
                        <Flex flexShrink="0" h="32px" alignItems="center" justifyContent="center">
                            {/*<StepTitle borderRadius="3px" py={1} px={2} color={index === questionNumber -1 ? 'amber.300': 'black'}>{index + 1} 단계</StepTitle>*/}
                            {/*<StepDescription>description</StepDescription>*/}
                        </Flex>
                        <StepSeparator
                            bg={index === poseNumber - 1 ? 'blueGray.50' : index < poseNumber - 1 ? ' amber.300!important' : 'blueGray.50'}/>
                    </Step>
                ))}
            </Stepper>
        </Flex>
    );
}

export default WordStepper;