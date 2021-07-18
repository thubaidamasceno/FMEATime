import Header from './Header';
import React from 'react';
import {connect} from 'react-redux';
import { LOGOUT, REDIRECT, APP_MENU} from '../constants/actionTypes';
import {Link, Route, Switch, withRouter} from 'react-router-dom';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {withStyles} from "@material-ui/core";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {approutes, menuitems} from '../modules';
import icons from "../icons";


const drawerWidth = 240;

export const styles = theme => {
    return {
        list: {
            width: 250,
        },
        fullList: {
            width: 'auto',
        },
        root: {
            // backgroundColor: "red",
            display: 'flex',
        },
        toolbar: {
            textAlign: "center",
            height: 48,
            minHeight: 24,
        },
        heading: {
            margin: "auto"
        },
        appBar: {
            // backgroundColor: "white",
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
            direction: theme.direction,
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            minHeight: '48px!important',
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            //marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    };
};

const mapStateToProps = state => {
    return {
        menuLeftOpen: state.common.menuLeftOpen,
        currentUser: state.common.currentUser,

    }
};

const mapDispatchToProps = dispatch => ({
    onClickLogout: () => dispatch({type: LOGOUT}),
    onMenu: (o) => dispatch({type: APP_MENU, open: o}),
});

class LeftMenu extends React.Component {
    render() {

        var filtredmenuitems = [];
        try {
            for (let i = 0; i < menuitems.length; i++) {
                try {
                    if (menuitems[i].length < 4 || (typeof menuitems[i][3] === 'function' && menuitems[i][3](this.props.role)))
                        filtredmenuitems = [...filtredmenuitems, menuitems[i]];
                } catch (e) {
                    console.log(e);
                }
            }
        } catch (e) {
            console.log(e);
        }

        const {classes} = this.props;
        let open = this.props.menuLeftOpen;

        let appmenu = [
            ["Sobre o FMEATime", icons.ChatIcon, "/"],
            ["FMEAS", <AssignmentIcon/>, "/fmeas"],
            //["Nova OS", <Add/>, "/editor"],
            'divider',
            ...filtredmenuitems,
            'divider',
            ["Minhas Atividades", <AssignmentIndIcon/>, '/@' + this.props.currentUser.username],
            ["Meu Cadastro", <AccountCircleIcon/>, "/settings"],
            ["Sair", <MeetingRoomIcon/>, "", {onClick: this.props.onClickLogout}],
        ];

        const toggleDrawer = (anchor, open) => (event) => {
            event.stopPropagation();
            if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
            }
            //this.setState({...this.state, [anchor]: open});
            this.props.onMenu(open);
            //window.open("/fishbone","Diagrama de causa e efeito", "toolbar=no,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        };

        const menuitem = (comp) => {
            if (comp === "divider") return (
                <Divider key={window.keygen()}/>
            ); else return (
                <ListItem button component={Link} to={comp[2]} key={window.keygen()} {...(comp[3])}>
                    <ListItemIcon>{comp[1]}</ListItemIcon>
                    <ListItemText primary={comp[0]}/>
                </ListItem>
            );
        };

        const list = (anchor) => (
            <div
                className={clsx(classes.list, {
                    [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                })}
                role="presentation"
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}
            >
                <List>
                    {appmenu.map(menuitem)}
                </List>
            </div>
        );
        let anchor = 'left';
        return (
            <div>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer(anchor, true)}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Header
                            appName={this.props.appName}
                            currentUser={this.props.currentUser}/>
                    </Toolbar>
                </AppBar>
                <React.Fragment key={window.keygen()}>
                    <Drawer anchor={anchor} open={this.props.menuLeftOpen} onClose={toggleDrawer(anchor, false)}>
                        {list(anchor)}
                    </Drawer>
                </React.Fragment></div>

        );
    }
}

const expd = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(withRouter(LeftMenu)));
export default expd;