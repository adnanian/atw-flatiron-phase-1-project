# My Word Bank
Author: Adnan Wazwaz

Version: 1.0

Original Date: 2023 October 16

Current Version Date: 2023 October 16

Adnanian Application #2

## Table of Contents

1. [Overview](#overview)
    1. [What This Application Does](#what-this-application-does)
    2. [Why This Application was Created](#why-this-application-was-created)
    3. [Technologies](#technologies)
    4. [Limitations](#limitations)
2. [Installation & Execution](#installation--execution)
    1. [Installation](#installation)
    2. [Execution](#execution)
3. [Usage](#usage)
    1. [Searching for a Word](#searching-for-a-word)
        1. [Search Results Found](#search-results-found)
        2. [Search Results Not Found](#search-results-not-found)
    2. [Working with the Glossary](#working-with-the-glossary)
4. [Future Plans](#future-plans)
5. [Credits](#credits)

## Overview

### What This Application Does

My Word Bank is a simple web-based application that allows users to search for the definitions of words and save them to their own custom glossary How it works is pretty straightforward: 

The user searches for a word and displays all definitions and examples in tables. There, he/she can choose a definition that they like and save it to the glossary. If no definitions are found, then the user can be redirected to Goolge search.

The user has the ability to display the glossary of saved terms as a table. In addition to that, at any time, a user is allowed to modify any entries or simply remove them.

### Why This Application was Created

This application was created as part of my Flatiron School Phase 1 project. I chose to create this application, because I believe that many people tend to forget the meanings of new words that they have learned, and there are times where searching for definitions of word requires the tedious task of clicking more links. I wish to reduce the number of clicks made just to find the right definition of a word that a user is looking for. It also helps to review any words that you recently learned by viewing your glossary instead of having to search for them one at a time. This is what makes this application unique from other dictionary websites.

### Technologies

There are several technologies used to create this application: Firstly, the languages chosen were HTML, CSS, and JavaScript. All code is enclosed in only one file for each language, meaning that in this project, there is only one HTML file, one CSS file, and one JavaScript file. It was written this way because a purpose this simple did not require more complications by adding more unnecessary code files. In addition the languages, the glossary is stored in a JSON file. 

By modifying the glossary, the user is modifying the JSON file itself. The last notable technology is the <a href="https://dictionaryapi.dev/" target="_blank">Free Dictionary API</a>. This API is what powers the word search functionality for this application. If you search for a word using the API, the result returned is a large, complex object that contains most of the following:

<ul>
    <li>Many definitions</li>
    <li>Some examples (depends on the word)</li>
    <li>The word's pronunciation:
        <ul>
            <li>IPA reading</li>
            <li>Audio file</li>
        </ul>
    </li>
    <li>Synonyms and antonyms (rarely)</li>
</ul>

### Limitations
Although this application functions as expected, there are some challenges that you need to be aware of:

<ol>
    <li>Not all words will be found in the API. For example: the words, <strong>xyst</strong>, and <strong>drab</strong>, although are real words, they do not exist in the API. Fortunately, however, the event of receiving no results for an actual word search is rare.</li><br/>
    <li>Unfortunately, not all words have a playable audio file to hear its pronunciation, which means, you would have to search for it outside this application.</li><br/>
    <li>Only a few definitions displayed to the user have example sentences. Most definitions are without examples. Perhaps it is because most definitions are rather similar to each other, that the creators of the API feel not the need to add an example for each definition. This is only a theory, so take this with a grain of salt.</li><br/>
    <li>When you wish to add a word to the glossary, or modify a saved word, a form will prompt the user to make the changes that he/she desires. More on this form later. Admittedly, the styling is not the best, but I have tried to style it as best as I could.</li>
</ol>

## Installation & Execution

### Installation

The good news is that installing this application is quite easy. This project is saved in my <a href="https://github.com/adnanian/atw-flatiron-phase-1-project" target="_blank">Flatiron School Phase 1 Project</a>. Please ensure that you have a GitHub account before attempting to install this application onto your local machine. Also ensure that you have Git installed on your local machine as well. If you don't, refer to <a href="https://github.com/git-guides/install-git" target="_blank">this help guide here.</a>

Once you have ensured the above two checks have passed, then all that's left is for you to fork and clone this repository. For those who are not as familiar with GitHub, here is a quick <a href="https://www.geeksforgeeks.org/difference-between-fork-and-clone-in-github/" target="_blank">GeeksForGeeks guide on forking and cloning</a>.

### Execution

To run the project, <b>open up your terminal</b>. Then, navigate to the directory where you have the repository cloned, and open the project. I stronly recommend opening this project with <a href="https://code.visualstudio.com/download" target="_blank">Visual Studio Code</a>, but you may use any other application (such as Notepad++) of your choosing as long as you're able to open up the HTML file on your browser. <b>DO NOT CLOSE THE TERMINAL YET!</b>

Once the project is opened, you will need to ensure that you have that you have the JSON server installed onto your machine. If you don't, then type in the following command onto your terminal, and then press <strong>ENTER</strong>: <code>npm install -g json-server</code>

Once you have ensured that the JSON server is installed, you'll have to run it in the directory where you cloned the repository. Enter this command in that directory: <code>json-server –watch db.json</code>

Open up the <strong>index.html</strong> file with a browser of your choice.

If you see the following page open up on your browser, then you have followed all instructions correctly:
![alt Successfully loaded application](./images/My%20Word%20Bank%20-%20Successfully%20Launched.png)

## Usage

As stated before, using this application is very straightforward. In this section, we will walkthrough with you each feature for this application.

### Searching for a Word
<ol>
    <li>Type in a word in the search bar. Then press ENTER or click the <strong>Submit</strong> button.<br/><img src="./images/Word Search Example.png" alt="Word Search Example"/></li>
</ol>

#### Search Results Found
<ol>
    <li>If the word exists in the Free Dictionary API, you should see a result like this below:<br/><img src="./images/Result Display Example.png" alt="Result Display Example"/></li>
    <li>Hover over the IPA to hear how the word is pronounced. The IPA will turn red and an audio file should automatically play the pronunciation to you.<br/><img src="./images/Hover for Pronunciation.png" alt="Hover for pronunciation."/></li>
    <li>Scroll through each definition in the tables displayed and choose a definition that you like. Each definition is indexed by a category number enclosed in a yellow button. To add a word, click on the yellow button adjacent to the definition.<br/><img src="./images/Choose a Word to Save.png" alt="Choose a Word to Save"/></li>
    <li>Once you clicked on a button to save a word, a green form with black text will be displayed to you, prompting you to confirm that you want to save the word with the current phonetic pronunciation, definition, and example. You may make modifications to these fields before submitting, and this will be updated to your glossary. However, note that you wouldn't be modifying the objects from the API itself. Click <strong>Submit</strong>, once you're finished.<br/><img src="./images/Glossary Form.png" alt="Add a word to the glossary example."/></li>
    <li><i><b>Important Note: </b> you can save the same word multiple times with each word having whatever definition you choose. They will be stored into the <strong>db.json</strong> file with different id values.</i></li>
</ol>

#### Search Results Not Found
<ol>
    <li>If the word does not exist in the API, you will see a result as shown in the picture below. <b>Note:</b> the word, "nein", is German, but this is simply for demonstrative purposes. If you are confident that the word exists, below is a yellow button, which will take you to a definition search on Google in a new tab.<br/><img src="./images/No Result Display Example.png" alt="Example of a search result not being found."/></li>
    <li>The yellow button on the right side under the search bar, <strong>Add to Glossary</strong> is enabled only when a search result is not found. This button allows you to add words that are not saved under any JSON object in the API. By clicking on this button, the green form will appear and allow you to add/modify any of the attribute values to your pleasing.<br/><img src="./images/Add to Glossary Button Enabled.png" alt="Add to Glossary button enabled."/></li>
</ol>

### Working with the Glossary
<ol>
    <li>To have the glossary displayed to you, click on the left button under the search bar, <strong>Load to Glossary</strong>.<br/><img src="./images/Load Glossary Button.png" alt="Load Glossary button selected."/></li>
    <li>You should see a table that looks like the following.<br><img src="./images/Glossary Loaded.png" alt="Glossary displayed as table."/><br/>Each row in the table contains the following columns:
    <ol type="a">
        <li>The row number. This is <em>NOT</em> the value of the JSON object's <strong>id</strong> attribute, but simply a number to count the number of rows in the table (and by extention, the number of words currently saved in your glossary).</li>
        <li>The word itself.</li>
        <li>The phonetic pronunciation. (No audio playblack included.)</li>
        <li>The chosen definition of the word.</li>
        <li>The example usage of the word. This may either be provided by the API itself, or is on that you found somewhere else. (Make sure you give credit.)</li>
        <li>For each row under the <strong>Edit</strong> column: A blue button for editing the word objects. If you click on one, the green glossary form will appear, which will allow you to modify the phonetic, definition, and/or example. Once you submit the form,the changes will be written to both <strong>db.json</strong> file, and the glossary table.</li>
        <li>For each row under the <strong>Delete</strong> column: A blue button for deleting word objects. If you click on one, the row that the button was clicked on will be removed from the table. And of course, the word object will be removed from the <strong>db.json</strong> file. You will not be prompted to confirm your deletion at this time, so be careful.</li>
    </ol></li>
</ol>

## Future Plans

Here are some ideas that I am considering to have implemented in future versions:<br/>
<ul>
    <li>Add a playable audio file attribute to the glossary JSON file. That way, when the user loads the glossary, he/she can hover over the IPA and hear the pronunciation. The challenge would be how to accomodate for words without a pronunciation.</li><br/>
    <li>Convert the glossary word cell from a mere text to a button. If the user wishes to see more definitions, it can be done by clicking on the already saved word instead of having to type it into the search bar again.</li><br/>
    <li>If there is no audio file for the word object from the API, display a message to the user indicating that in the event that he/she attempts to hover over the phonetic reading to hear the pronunciation. We don't want anyone to erroneously draw the conclusion that there is a bug in the program.</li><br/>
    <li>Set a scrollbar to the tables itself, instead of the entire page. So that the user has the ability to access the search bar wihtout having to constantly scroll back up. The challenge would be how to best display them for the search results, which can contain multiple tables.</li><br/>
    <li>Create a much more professional logo. The current one was poorly created on a whim, using Microsoft Paint 3D.</li>
</ul>

## Credits
MIT License

Copyright (c) 2023 Adnan Wazwaz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Of course, credit goes to the developers at GitHub from <a href="https://github.com/meetDeveloper/freeDictionaryAPI">Free Dictionary API</a>.