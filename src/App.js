import './App.css';
import React, { useState } from 'react';
import P5Sketch from './components/p5-sketch';
import './assets/tailwind.css';

function App() {
  const [cssCode, setCssCode] = useState("");

  const [numWords, setNumWords] = useState("");
  const [numChars, setNumChars] = useState("");
  const [numLogLengths, setNumLogLengths] = useState("");

  const [refreshSketch, setRefreshSketch] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isResultsSectionVisible, setIsResultsSectionVisible] = useState(false);

  
  const [buttonText, setButtonText] = useState("Estimate heterogeneity");


  
  

  const changeOrientation = () => {
    setCssCode(getRandomLogFileName());
    setCssCode(prevCode => prevCode);
    setRefreshSketch(!refreshSketch);
  };

  const logFileNames = [
    "Apache",
    "BlueGene",
    "Spark",
    "Nginx",
    "Tomcat",
    "IIS",
    "Syslog",
    "Elasticsearch",
    "Android",
    "HDFS",
    "HPC",
    "OpenStack"
  ];

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function demo() {
    console.log('Taking a break...');
    await sleep(2000);
    console.log('Two second later');
  }

  function computeFileStatistics(event) {
    event.preventDefault();
  
    // Accessing the file from the FormData object
    var fileInput = event.target.querySelector('input[type="file"]');
    var file = fileInput.files[0];
  
    if (file) {
      var reader = new FileReader();
  
      reader.onload = async function (event) {
        await sleep(2000);
        const fileContent = event.target.result;
  
        const uniqueCharacters = new Set(fileContent).size;
        setNumChars(uniqueCharacters);
        console.log('Number of unique characters:', uniqueCharacters);
  
        const words = fileContent.split(/\s+/);
        const uniqueWords = new Set(words).size;
        setNumWords(uniqueWords);
        console.log('Number of unique words:', uniqueWords);
  
        const logLengthsPerLine = fileContent.split('\n').map(line => line.length);
        const uniqueLogLengths = new Set(logLengthsPerLine).size;
        setNumLogLengths(uniqueLogLengths);
        console.log('Number of unique log lengths:', uniqueLogLengths);

        setIsResultsSectionVisible(true)
      };
  
      reader.readAsText(file);
      setIsVisible(true)
      setDisabled(true)
    } else {
      console.error('No file selected.');
      // Handle the case where no file is selected
    }
  }

  function  refreshPage(event) {
    window.location.reload();
  }

  function getRandomLogFileName() {
    const randomIndex = Math.floor(Math.random() * logFileNames.length);
    return logFileNames[randomIndex];
  }

  return (
    <div className='container'>
      <div className="grid items-end h-screen md:fixed justify-center inset-0 px-10 overlay overflow-auto">
        <div className="px-4 py-6">
          <h1 className="md:text-6xl text-white font-extrabold text-center text-4xl">LogKim</h1>
          <h1 className="md:text-1xl py-2 text-white text-center text-1xl">Estimate heterogeneity for your log data.</h1>
          <div className="flex items-center justify-center py-3 mt-2 gap-2 flex-wrap md:gap-5">

          <div>
          {!isResultsSectionVisible && (
          <form onSubmit={computeFileStatistics} className="flex flex-col justify-center items-center">
            <input className="block border text-sm specific-border rounded-lg cursor-pointer bg-gray-400 bg-opacity-30 dark:text-gray-100" aria-describedby="file_input_help " id="file_input" type="file" name="my_file" required></input>
            <p className="mt-1 text-sm text-white dark:text-white" id="file_input_help">LOG or TXT (MAX. 2GB).</p>
            <button disabled={disabled} type="submit" className="text-center hover:from-white border text-sm hover:to-white text-white hover:ring-1 hover:ring-offset-1 hover:ring-white transition-all ease-out duration-300 mt-3 gap-3 py-2 px-3 justify-center inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg specific-border hover:border-white hover:text-white disabled:opacity-50 disabled:pointer-events-none">
              <div role="status">
                  {isVisible && (
                  <div>
                    <svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                  </div>
                  )}
              </div>
              {buttonText}
            </button>
          </form>
          )}
          </div>
          </div>
          
          <div>
          {isResultsSectionVisible && (
            <div className="grid items-center justify-center mt-2 gap-2 flex-wrap md:gap-1">
              <div className="box md:w-[640px] w-[350px] h-auto mx-auto break-all mt-1 p-2 ">
              <p className="p-3 text-gray-200 font-mono text-base md:text-xl text-center font-semibold">
                <span className="text-gray-100 text-left">
                  <pre>{`${cssCode}`}</pre>
                  <pre className="text-white text-left">{`Results: {\n\tnumWords: ${numWords},\n\tnumChars: ${numChars},\n\tnumLogLengths: ${numLogLengths}\n}`}</pre>
                </span>
              </p>
              </div>
              <div className="flex items-center justify-center w-full">
                    <button onClick={refreshPage} className="max-w-[300px] text-center hover:from-white border text-sm hover:to-white text-white hover:ring-1 hover:ring-offset-1 hover:ring-white transition-all ease-out duration-300 mt-3 gap-3 py-2 px-3 justify-center inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg specific-border hover:border-white hover:text-white disabled:opacity-50 disabled:pointer-events-none">
                        <svg className="w-5 h-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span className="mx-1">Retry!</span>
                    </button>
              </div>
          </div>
          )
          }
          
          </div>
          {/* <div className="box md:w-[640px] w-[350px] h-auto mx-auto break-all mt-4 p-2 ">
            <p className="p-3 text-gray-200 font-mono text-base md:text-xl text-center font-semibold">
              <span className="text-gray-100 text-left">
                <pre>{`${cssCode}`}</pre>
                <pre className="text-white text-left">{`Results: {\n\t\t  numWords: ${numWords},\n\t\t  numChars: ${numChars},\n\t\t  numLogLengths:  ${numLogLengths}\n}`}</pre>
              </span>
            </p>
          </div> */}
        </div>

        <footer className="mx-auto bg-opacity-5 rounded-lg m-4 text-white">
              <div className="p-4 md:flex text-white md:items-center justify-center">
                <span className="text-sm text-white sm:text-center">© 2024 <a href="https://www.ise.uni-hannover.de/de/vss" className="text-white hover:underline">VSS</a>. All Rights Reserved.</span>
              </div>
        </footer>
      </div>
      <div className='sketch'>
        <P5Sketch key={refreshSketch} className='example-style' />
      </div>
    </div>
  );
}
export default App;