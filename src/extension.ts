// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as mm from 'music-metadata';

const wavPlayer = require("node-wav-player");
const path = require("path");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "codechampion-vscode" is now active!'
  );
  
  let statusMessage: any | undefined;

  async function playSound(winOrFail: string) {
    let isWin = (winOrFail === 'win');

    let configs = vscode.workspace.getConfiguration();
    
    let soundFileNameInConfig: any | undefined = " ";
    soundFileNameInConfig = isWin 
      ? configs.get("codechampion.victorySoundConfig")
      : configs.get("codechampion.failSoundConfig");

    let soundFileName =
      soundFileNameInConfig.split(" ").join("_") + ".wav";


    let soundFilePath = path.join(
      __dirname,
      "..",
      "sounds",
      winOrFail,
      soundFileName
    );

    let duration:number | undefined;
    await mm.parseFile(soundFilePath)
      .then(metadata => {
        duration = metadata.format.duration;
      })
      .catch((err) => {
        console.error(err.message);
      });

    await wavPlayer
      .play({
        path: soundFilePath,
      })
      .then(() => {
        console.log("The wav file started to be played successfully.");
      })
      .catch((error: any) => {
        console.error(error);

      });
    return new Promise(resolve => {
      resolve(duration);
    });
  }

  let playVictorySound = vscode.commands.registerCommand(
    "extension.playVictorySound",
    () => {  
      playSound('win')
        .then((dur) => {
          const duration:any = dur;
          statusMessage = vscode.window.setStatusBarMessage("Congratulations!", duration * 1000);
        });      
    }
  );

  let playFailSound = vscode.commands.registerCommand(
    "extension.playFailSound",
    () => {
      playSound('fail')
        .then((dur) => {
          const duration: any = dur;
          statusMessage = vscode.window.setStatusBarMessage("It's Ok, Don't worry!", duration * 1000);
        });   
    }
  );

  let stopSound = vscode.commands.registerCommand(
    "extension.stopSound",
    () => {
      wavPlayer.stop();
      statusMessage.dispose();     
    }
  );

  context.subscriptions.push(playVictorySound);
  context.subscriptions.push(playFailSound);
  context.subscriptions.push(stopSound);
}

// this method is called when your extension is deactivated
export function deactivate() {}
