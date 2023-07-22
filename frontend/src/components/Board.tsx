import React from 'react';
import { Box, Card, Link, Typography, Divider, Stack, ImageList, ImageListItem, CardActionArea } from '@mui/material';

interface Properties {
    name?: string;
    stage?: number;
}

const dataTask = [
    {
        id: 1,
        name: 'Iniciando'
    },
    {
        id: 2,
        name: 'En proceso'
    },
    {
        id: 3,
        name: 'Pruebas'
    },
    {
        id: 4,
        name: 'Finalizado'
    },
    // {
    //     id: 5,
    //     name: 'Iniciando'
    // },
    // {
    //     id: 6,
    //     name: 'En proceso'
    // },
    // {
    //     id: 7,
    //     name: 'Pruebas'
    // },
    // {
    //     id: 8,
    //     name: 'Finalizado'
    // }
];

const issues = [
    {
        id: 1,
        name: 'realizar el dashboard',
        stage: 1
    },
    {
        id: 2,
        name: 'realizar el login',
        stage: 2
    },
    {
        id: 3,
        name: 'realizar el register',
        stage: 3
    },
    {
        id: 4,
        name: 'realizar el logout',
        stage: 4
    },
    {
        id: 5,
        name: 'realizar el tour',
        stage: 1
    },
    {
        id: 6,
        name: 'realizar el navbar',
        stage: 3
    },
    {
        id: 7,
        name: 'realizar el aside',
        stage: 1
    },
    {
        id: 8,
        name: 'realizar el toolbar',
        stage: 2
    },
];

const CardIssue = ({ name, stage }: Properties) => (
    <CardActionArea onAuxClick={(event) => {
        event.preventDefault
        alert("asdas")
    }}>
        <Card sx={{ width: "100%", padding: "8px", margin: "0px !important" }}>
            <Link underline="none" variant="body2" sx={{ fontWeight: 500 }}>
                {name}
            </Link>
            <Typography variant="body2" color="text.secondary">
                Stage: {stage}
            </Typography>
        </Card>
    </CardActionArea>
);

const Board = () => (
    <Box sx={{ minWidth: 275 }} padding={3}>
        <ImageList gap={12} sx={{ gridAutoFlow: "column", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr)) !important", gridAutoColumns: "minmax(300px, 1fr)" }}>
            {dataTask.map((task) => (
                <ImageListItem key={task.id}>
                    <Card>
                        <Stack padding={[0, 2]} direction="column" alignItems="start">
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {task.name}
                            </Typography>
                        </Stack>
                        <Divider />
                        <Stack padding={2} spacing={2} gap={1} direction="column" alignItems="center" sx={{ minHeight: 450 }}>
                            {issues
                                .filter((issue) => issue.stage === task.id)
                                .map((filteredIssue) => (
                                    <CardIssue
                                        key={filteredIssue.id}
                                        name={filteredIssue.name}
                                        stage={filteredIssue.stage}
                                    />
                                ))}
                        </Stack>
                    </Card>
                </ImageListItem>
            ))}
        </ImageList>
    </Box>
);

export default Board;
