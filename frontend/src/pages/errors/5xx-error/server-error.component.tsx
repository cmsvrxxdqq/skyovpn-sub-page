import { Container, Group, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { GlassButton } from '@shared/ui'
import classes from './ServerError.module.css'

export function ErrorPageComponent() {
    const navigate = useNavigate()

    const handleRefresh = () => {
        navigate(0)
    }

    return (
        <div className={classes.root}>
            <Container>
                <div className={classes.label}>500</div>
                <Title className={classes.title}>Something bad just happened...</Title>
                <Text className={classes.description} size="lg" ta="center">
                    Try to refresh the page.
                </Text>
                <Group justify="center">
                    <GlassButton onClick={handleRefresh}>
                        Refresh the page
                    </GlassButton>
                </Group>
            </Container>
        </div>
    )
}
