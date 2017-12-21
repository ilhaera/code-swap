'use babel';

import CodeSwapView from './code-swap-view';
import { CompositeDisposable } from 'atom';

export default {

  codeSwapView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.codeSwapView = new CodeSwapView(state.codeSwapViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.codeSwapView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-swap:toggle': () => this.toggle(),
      'code-swap:generate': () => this.generate(),
      'code-swap:switchToggle' : ()=> this.switchToggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.codeSwapView.destroy();
  },

  serialize() {
    return {
      codeSwapViewState: this.codeSwapView.serialize()
    };
  },

  toggle() {

    atom.notifications.addInfo('Code-swap toggled!')

  },
  generate() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let text = "\n////"+"code1\n\n/*///code2\n\n/* *///\n"
      editor.insertText(text)
    }
  },
  switchToggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {

      let text = editor.getText()
      if (text.indexOf("////"+"code1")!=-1){
        editor.scan(/\/\/\/\/code1/g,(found)=>{found.replace('/*///'+'code1')})
      }
      else if (text.indexOf("/*///"+"code1")!=-1){
        editor.scan(/\/\*\/\/\/code1/g,(found)=>{found.replace('////'+'code1')})
      }
      else{
        atom.notifications.addWarning('Generate case first.')
      }





    }
  }
};
