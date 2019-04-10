// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

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
  function playSound(winOrFail: string) {
    var isWin = false;
    if (winOrFail === 'win') isWin = !isWin;

    var configs = vscode.workspace
    .getConfiguration();
    
    var soundFileNameInConfig: string | undefined = " ";
    soundFileNameInConfig = isWin ? configs.get("codechampion.victorySoundConfig") : configs.get("codechampion.failSoundConfig");

    var soundFileName =
      soundFileNameInConfig.split(" ").join("_") + ".wav";

    var soundFilePath = path.join(
      __dirname,
      "..",
      "sounds",
      winOrFail,
      soundFileName
    );
    wavPlayer
      .play({
        path: soundFilePath
      })
      .then(() => {
        console.log("The wav file started to be played successfully.");
      })
      .catch(error => {
        console.error(error);
      });
  }

  let playVictorySound = vscode.commands.registerCommand(
    "extension.playVictorySound",
    () => {
      vscode.window.setStatusBarMessage("Congratulations!", 2000);

      playSound('win');
    }
  );


  let playFailSound = vscode.commands.registerCommand(
    "extension.playFailSound",
    () => {
      vscode.window.setStatusBarMessage("It's Ok, Don't worry!", 2000);

      playSound('fail');
    }
  );

  let stopSound = vscode.commands.registerCommand(
    "extension.stopSound",
    () => {
      wavPlayer.stop();        
    }
  );

  context.subscriptions.push(playVictorySound);
  context.subscriptions.push(playFailSound);
  context.subscriptions.push(stopSound);

}

// this method is called when your extension is deactivated
export function deactivate() {}
