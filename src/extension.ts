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

  let playVictorySound = vscode.commands.registerCommand(
    "extension.playVictorySound",
    () => {
      var victoryFileNameInConfig: string | undefined = " ";
      victoryFileNameInConfig = vscode.workspace
        .getConfiguration()
        .get("codechampion.victorySoundConfig");

      var victoryFileName =
        victoryFileNameInConfig.split(" ").join("_") + ".wav";
      var soundFilePath = path.join(
        __dirname,
        "..",
        "sounds",
        "win",
        victoryFileName
      );

      vscode.window.setStatusBarMessage("Congratulations!", 2000);

      wavPlayer
        .play({
          path: soundFilePath
        })
        .then(() => {
          console.log("The wav file started to be played successfully.");
        })
        .catch(error) => {
          console.error(error);
        });
    };


    let playFailSound = vscode.commands.registerCommand(
      "extension.playFailSound",
      () => {
        var failFileNameInConfig: string | undefined = " ";
        failFileNameInConfig = vscode.workspace
          .getConfiguration()
          .get("codechampion.failSoundConfig");
  
        var failFileName =
          failFileNameInConfig.split(" ").join("_") + ".wav";
        var soundFilePath = path.join(
          __dirname,
          "..",
          "sounds",
          "fail",
          failFileName
        );
  
        vscode.window.setStatusBarMessage("It's Ok, Don't worry!", 2000);
  
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
  );

  context.subscriptions.push(playVictorySound);
  context.subscriptions.push(playFailSound);

}

// this method is called when your extension is deactivated
export function deactivate() {}
