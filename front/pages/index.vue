<template>
  <div>
    <div id="header">
      <h1>Emojicode interpreter</h1>
    </div>
    <div id="main-section">
      <div id="input">
        <h2>Input</h2>
        <a-textarea v-model="input" placeholder="Enter emojicode here..." :rows="10" class="code" :autoSize="{ minRows: 4, maxRows: 20 }" @change="saveCode" />
      </div>
      <div id="output">
        <h2>Output</h2>
        <div id="outputContainer" class="code">{{output}}</div>
      </div>
    </div>
    <div id="commands-section">
      <a-button type="primary" @click="runCode">
        <!-- <template #icon><SearchOutlined /></template> -->
        Run code
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',

  mounted() {
    console.log();

    if (!this.getSavedInput()) {
      this.input = `🏁 🍇\n  😀 🔤Hello, World!🔤❗️\n🍉`
    } else {
      this.input = this.getSavedInput()
    }
  },

  data() {
    return {
      input: '',
      output: 'Run your program to generate an output'
    }
  },
  methods: {
    async runCode() {
      // Local
      // const output = await this.$axios.$post('http://localhost:3000/ec2', this.buildRequestBody())
      // PROD
      const output = await this.$axios.$post('https://001pb4wxv8.execute-api.us-east-1.amazonaws.com/ec2', this.buildRequestBody())
      this.output = output.message.logs
      console.log(output);
    },
    buildRequestBody() {
      return {
        code: this.input
      }
    },
    saveCode() {
      localStorage.setItem('input', this.input);
    },
    getSavedInput() {
      return localStorage.getItem('input');
    }
  }
}
</script>

<style>
#main-section {
  display: flex;
  justify-content: space-between;
}

#main-section > * {
  width: 49%;
}

textarea {
  /* font-size: 1.5em;
  color: black; */
}

#outputContainer {
  white-space: pre-line;
}
.code {
  font-size: 1.3em;
  color: black;
  font-family: monospace;
}

.code > * {
  font-size: 1.1em;
  color: black;
  font-family: monospace;
}

#commands-section {
  margin-top: 16px;
}

</style>
