import React, {useContext} from 'react';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {isLogin} from "../../../utils";
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import Content from "../../content/Content";
import {BrowserRouter, Link} from "react-router-dom";
import {ctxt} from "../../../utils/UserContext";
import {Avatar, Collapse} from '@material-ui/core';
import {
    ExpandLess,
    ExpandMore,
    FiberNew,
    GridOn,
    Group,
    SportsEsports,
    SportsTennis,
    Transform
} from "@material-ui/icons";


const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        avatar: {
            width: '30px',
            height: '30px',
        }
    }),
);

export default function Header() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openGames, setOpenGames] = React.useState(false);
    const [openGamesHistorical, setOpenGamesHistorical] = React.useState(false);
    let appContext = useContext(ctxt);

    const userAvatar = () => {
        let user = appContext.user

        return (
            <Avatar alt={user.nickname} src={user.image_uri} className={classes.avatar}/>
        )
    }

    const handleClickOpenGames = () => {
        setOpenGames(!openGames);
    };

    const handleClickOpenGamesHistorical = () => {
        setOpenGamesHistorical(!openGamesHistorical);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const logout = () => {
        localStorage.clear()
        window.location.replace('/')
    };

    const LinkToNewGame = React.forwardRef((p, _ref) => {
        return (<Link to={"/game/new"} {...p} />)
    })
    const LinkToGames = React.forwardRef((p, _ref) => {
        return (<Link to={"/games"} {...p} />)
    })
    const LinkToUserGames = React.forwardRef((p, _ref) => {
        return (<Link to={"/user/games"} {...p} />)
    })
    const LinkToPlayers = React.forwardRef((p, _ref) => {
        return (<Link to={"/user/list"} {...p} />)
    })
    const LigueTab = React.forwardRef((p, _ref) => {
        return (<Link to={"/ligue/tab"} {...p} />)
    })
    const LigueTabHistorical = React.forwardRef((p, _ref) => {
        return (<Link to={"/ligue/tab/historical"} {...p} />)
    })
    const LinkToGamesHistorical = React.forwardRef((p, _ref) => {
        return (<Link to={"/games/historical"} {...p} />)
    })
    const LinkToUserGamesHistorical = React.forwardRef((p, _ref) => {
        return (<Link to={"/user/games/historical"} {...p} />)
    })
    const LinkToProfile = React.forwardRef((p, _ref) => {
        return (<Link to={"/user/me"} {...p} />)
    })
    const LinkToLogin = React.forwardRef((p, _ref) => {
        return (<Link to={"/login"} {...p} />)
    })

    return (
        <BrowserRouter>
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            PPONG
                        </Typography>
                        <Typography variant="h6" noWrap>

                        </Typography>

                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    {isLogin() && <List>
                        <ListItem button key={"players"} component={LinkToPlayers}>
                            <ListItemIcon><Group/></ListItemIcon>
                            <ListItemText primary={"Zawodnicy"}/>
                        </ListItem>
                        <ListItem button onClick={handleClickOpenGames}>
                            <ListItemIcon>
                                <GridOn/>
                            </ListItemIcon>
                            <ListItemText primary="Bieżąca rozgrywka"/>
                            {openGames ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openGames} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className={classes.nested}>
                                <ListItem button key={"games"} component={LigueTab}>
                                    <ListItemIcon><Transform/></ListItemIcon>
                                    <ListItemText primary={"Tabela"}/>
                                </ListItem>
                                <ListItem button key={"games"} component={LinkToGames}>
                                    <ListItemIcon><SportsTennis/></ListItemIcon>
                                    <ListItemText primary={"Wszystkie gry"}/>
                                </ListItem>
                                <ListItem button key={"user-games"} component={LinkToUserGames}>
                                    <ListItemIcon><SportsEsports/></ListItemIcon>
                                    <ListItemText primary={"Moje gry"}/>
                                </ListItem>
                                <ListItem button key={"new-game"} component={LinkToNewGame}>
                                    <ListItemIcon><FiberNew/></ListItemIcon>
                                    <ListItemText primary={"Nowa gra"}/>
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button onClick={handleClickOpenGamesHistorical}>
                            <ListItemIcon>
                                <GridOn/>
                            </ListItemIcon>
                            <ListItemText primary="Poprzednie rozgrywki"/>
                            {openGamesHistorical ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={openGamesHistorical} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className={classes.nested}>
                                <ListItem button key={"games-historical"} component={LigueTabHistorical}>
                                    <ListItemIcon><Transform/></ListItemIcon>
                                    <ListItemText primary={"Tabela"}/>
                                </ListItem>
                                <ListItem button key={"games-historical"} component={LinkToGamesHistorical}>
                                    <ListItemIcon><SportsTennis/></ListItemIcon>
                                    <ListItemText primary={"Wszystkie gry"}/>
                                </ListItem>
                                <ListItem button key={"user-games-historical"} component={LinkToUserGamesHistorical}>
                                    <ListItemIcon><SportsEsports/></ListItemIcon>
                                    <ListItemText primary={"Moje gry"}/>
                                </ListItem>
                            </List>
                        </Collapse>
                    </List>}
                    <Divider/>
                    {isLogin() && <List>
                        <ListItem button key={"profile"} component={LinkToProfile}>
                            <ListItemIcon>{userAvatar()}</ListItemIcon>
                            <ListItemText primary={"Profil"}/>
                        </ListItem>
                        <ListItem button key={"logout"} onClick={logout}>
                            <ListItemIcon><MailIcon/></ListItemIcon>
                            <ListItemText primary={"Logout"}/>
                        </ListItem>
                    </List>}
                    {!isLogin() && <List>
                        <ListItem button key={"login"} component={LinkToLogin}>
                            <ListItemIcon><MailIcon/></ListItemIcon>
                            <ListItemText primary={"Login"}/>
                        </ListItem>
                    </List>}
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader}/>

                    <Content/>
                </main>
            </div>
        </BrowserRouter>
    );
}
