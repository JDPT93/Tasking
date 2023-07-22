import React from 'react';
import { Box, Card, Link, Typography, Divider, Stack, ImageList, ImageListItem, CardActionArea, Menu, MenuItem, ListItemText,ListItemIcon } from '@mui/material';
import Cloud from '@mui/icons-material/Cloud';

interface Properties {
    name?: string;
    stage?: number;
}

const dataTask = [
    {
        id: 1,
        name: 'Iniciando',
        active: true,
    },
    {
        id: 2,
        name: 'En proceso',
        active: true,
    },
    {
        id: 3,
        name: 'Pruebas',
        active: true,
    },
    {
        id: 4,
        name: 'Finalizado',
        active: true,
    },
    // {
    //     id: 5,
    //     name: 'Iniciando',
    //     active: true,
    // },
    // {
    //     id: 6,
    //     name: 'En proceso',
    //     active: true,
    // },
    // {
    //     id: 7,
    //     name: 'Pruebas',
    //     active: true,
    // },
    // {
    //     id: 8,
    //     name: 'Finalizado',
    //     active: true,
    // }
];

const issues = [
    {
        id: 1,
        name: 'realizar el dashboard',
        stage: 1,
        active: true,
    },
    {
        id: 2,
        name: 'realizar el login',
        stage: 2,
        active: true,
    },
    {
        id: 3,
        name: 'realizar el register',
        stage: 3,
        active: true,
    },
    {
        id: 4,
        name: 'realizar el logout',
        stage: 4,
        active: true,
    },
    {
        id: 5,
        name: 'realizar el tour',
        stage: 1,
        active: true,
    },
    {
        id: 6,
        name: 'realizar el navbar',
        stage: 3,
        active: true,
    },
    {
        id: 7,
        name: 'realizar el aside',
        stage: 1,
        active: true,
    },
    {
        id: 8,
        name: 'realizar el toolbar',
        stage: 2,
        active: true,
    },
];

const CardIssue = ({ name, stage }: Properties) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <CardActionArea
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Card sx={{ width: "100%", padding: "8px", margin: "0px !important" }}>
                    <Link underline="none" variant="body2" sx={{ fontWeight: 500 }}>
                        {name}
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                        Stage: {stage}
                    </Typography>
                </Card>
            </CardActionArea>

            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Cloud fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Web Clipboard</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
};

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

const MenuOption = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
    >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
    </Menu>
}

export default Board;
