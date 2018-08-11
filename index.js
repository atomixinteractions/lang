#!/usr/bin/env node

const example = `
  let a = 1;
  let b = a;
`;

// let a = 1; Variable Id Apply Int
// keyword(let) identifier(a) equal integer(1)


// identifier: [a-zA-Z][0-9a-zA-Z_$]+
// keyword: (let|fn)
// equal: =
// integer: [0-1]+


const STATE = {
  nothing: 0,
  identifier: 1,
  integer: 2,
}

const KEYWORDS = ['let']

class Lexer {
  constructor(input) {
    this.state = STATE.nothing;
    this.input = input;
    this.position = 0;
    this.lexems = []
    this.current = { type: '', content: '' }
  }

  nextChar() {
    return this.input[this.position + 1]
  }

  currentChar() {
    return this.input[this.position]
  }

  finishLexem() {
    this.lexems.push(this.current)
    this.current = { type: '', content: '' }
    this.state = STATE.nothing
  }

  eatIdentifier() {
    const char = this.currentChar()
    this.current.content += char

    if (!(/\w/.test(this.nextChar()))) {
      if (KEYWORDS.includes(this.current.content)) {
        this.current.type = 'keyword'
      }

      this.finishLexem()
    }

    this.position++
  }

  eatInteger() {
    this.current.content += this.currentChar()

    const isNextInt = /\d/.test(this.nextChar());
    if (!isNextInt) {
      this.finishLexem()
    }

    this.position++
  }

  eatNothing() {
    const char = this.currentChar();

    switch (true) {
      // EOE — End of Expression
      case ';' === char: {
        this.current = { type: 'eoe' }
        this.finishLexem()
        this.position++
      }

      // identifier
      case /[a-zA-Z]/.test(char): {
        this.state = STATE.identifier
        this.current.type = 'identifier'
        break;
      }

      // integer
      case /\d/.test(char): {
        this.state = STATE.integer;
        this.current.type = 'integer'
        break;
      }

      // spaces
      case /\s/.test(char): {
        // space?
        this.position++;
        break;
      }

      // equal
      case '=' === char: {
        this.position++;
        this.current = { type: 'equal' }
        this.finishLexem();
        break;
      }
    }
  }

  eat() {
    while (this.input.length > this.position) {
      switch (this.state) {
        case STATE.nothing: {
          this.eatNothing();
          break;
        }
        case STATE.identifier: {
          this.eatIdentifier();
          break;
        }
        case STATE.integer: {
          this.eatInteger();
          break;
        }
      }
    }
    return this.lexems
  }
}

function parse(input) {
  const lexer = new Lexer(input)

  return lexer.eat()
}


console.log(
  parse(example)
)
