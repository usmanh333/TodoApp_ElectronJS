const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain} = electron

let mainWindow;
let addWindow;

app.on('ready', ()=>{
    mainWindow = new BrowserWindow({ webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
    }});
    mainWindow.loadURL(`file://${__dirname}/main.html`)
    mainWindow.on('closed', ()=> app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu);
})

function createAddWindow() {
    addWindow = new BrowserWindow({webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
    },
        width:300,
        height: 200,
        title:'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/addTodo.html`)
    addWindow.on('closed', ()=> addWindow === null);
}

ipcMain.on('todo:add', (event, value)=>{
    mainWindow.webContents.send('todo:add', value)
    addWindow.close()
})

const menuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Add Todo',
                click(){
                    createAddWindow();
                }
            },{
                label: 'Clear Todo List',
                click(){
                    mainWindow.webContents.send('todo:clear')
                }
            },
            {
                label:'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label:'View',
        submenu:[
            {role:'reload'},
            {
            label: 'Toggle Developer Tools',
            accelerator: 'CmdOrCtrl+ShiftOrAlt+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
        }
    ]
    })
}