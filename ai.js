const fetch = require('node-fetch');

async function askAI(message) {
  if (!message) throw new Error('Missing message');

  if (/your name|who are you|what is your name|name\?/i.test(message)) {
    return 'Harpertoken';
  }
  if (
    /repo|repository|project|together cli|together api|what can you do|what is this|about you|about this|what are you|who made you|who built you|github|source code|cli tool|languages supported|how to use|usage|setup|license|how does it work|explain|describe|tell me about/i.test(
      message,
    )
  ) {
    return `You can learn more about this project at https://github.com/bniladridas/togethercli\n\nTogether API CLI Tools: Effortlessly interact with the Together API using the nvidia/Llama-3.1-Nemotron-70B-Instruct-HF model. This repository offers sleek, powerful CLI tools crafted in multiple languages.\n\nLanguages:\n- Rust: Fast, reliable prompt-to-response interaction.\n- R: Seamless API integration for data-driven workflows.\n- Scala: Elegant, scalable command-line prompting.\n- Fortran: Robust API calls via curl system integration.\n\nSetup: Create a .env file in the root or language-specific folder with TOGETHER_API_KEY=your_api_key_here. Ensure a .env file is present in the following project folders: typescript-cli, go-cli, javascript-cli, java-cli, scala-cli, ruby-cli.\n\nUsage: Each CLI takes a prompt as a command-line argument and delivers the API's response with precision.\n- Rust: cd rust-cli && cargo run -- "Your prompt here"\n- R: Rscript r-cli/cli.R "Your prompt here"\n- Scala: cd scala-cli && sbt run "Your prompt here"\n- Fortran: gfortran fortran-cli/main.f90 -o fortran-cli/together_cli && ./fortran-cli/together_cli "Your prompt here"\n\nNotes: Ensure your .env file contains a valid API key. Fortran uses curl for HTTP requests. Special characters in prompts are escaped for reliable JSON payloads.\n\nLicense: Provided as-is, without warranty.`;
  }

  // Call Together API
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    throw new Error('TOGETHER_API_KEY not set');
  }

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.1-70B-Instruct-Turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are Harpertoken, a helpful AI assistant. Keep responses concise and relevant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ['<|eot_id|>', '<|eom_id|>'],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

module.exports = { askAI };
