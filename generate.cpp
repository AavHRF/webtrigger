//
// Created by Aav on 6/3/2020.
//

#include <iostream>
#include <vector>

using namespace std;

void noFormat(){
    /// Declare vectors for storage of information
    vector<string> updaters;
    vector<string> targets;

    /// Declare loop counters
    int numOfUpdaters;
    int numOfTargets;

    /// Declare filestream
    ofstream reportFile;

    /// Set that counter
    cout << "Please enter the number of people at update: ";
    cin >> numOfUpdaters;

    /// Enter loop to collect updater information and push it into the vector
    for (int ii = 0; ii < numOfUpdaters; ii++) {
        string updaterName;
        cout << "Enter name of updater. Replace spaces with underscores: ";
        cin >> updaterName;
        updaters.push_back(updaterName);
    }

    /**
     * This loop here is for testing purposes **only**. Make sure to comment
     * out once finished testing.
     *
     * If you are reading this code and looking for tools to debug this
     * because you downloaded the source, and broke it, please download
     * the binary and try again, this time without fiddling with anything.
     * This program is super simple, I don't know how you broke it.
     *
     * If you're still trying to debug it, you may as well uncomment this loop
     * and see if you can figure out anything with it that way, it can't
     * hurt, can it.
     */

    /**for(int tt = 0; tt < updaters.size(); tt++){
    *    cout << updaters[tt] << endl;
    * }
    */

    /// Get number of targets
    cout << "Please enter the number of total hits: ";
    cin >> numOfTargets;

    /// Enter loop to collect target information and push it into the vector
    for (int kk = 0; kk < numOfTargets; kk++) {
        /**
         * Fuck you. Yes, I got exceptions on this. Yes,
         * my response to getting exceptions was just
         * "oh I'll wrap it in a try/catch."
         * Fuck you future developer trying to maintain
         * this despite not knowing what exceptions
         * I was getting on a standard input/output
         * loop. The world will never know.
         */
        try{
            string targetName;
            cout << "Enter name of target, replace space with underscore: ";
            cin >> targetName;
            targets.push_back(targetName);
        }
        catch(exception& e){
            cout << "An exception " << e.what() << "has occured." << endl;
        }
    }
    reportFile.open("report.txt", ios::out | ios::app);
    reportFile << "Number of Updaters: " << numOfUpdaters << "\n";
    reportFile << "Who Updated: \n";
    reportFile.close();
    for (int uu = 0; uu < updaters.size(); uu++) {

        /// Fuck you, exceptions.
        try{
            reportFile.open("report.txt", ios::out | ios::app);
            reportFile << updaters[uu] << "\n";
            reportFile.close();
        }
        catch(exception& e){
            cout << "An error " << e.what() << "has occured." << endl;
        }
    }
    reportFile.open("report.txt", ios::out | ios::app);
    reportFile << "Targets Hit: " << numOfTargets << "\n";
    reportFile << "Targets: " << "\n";
    reportFile.close();
    for (int tt = 0; tt < targets.size(); tt++){

        /// Don't even fucking try. I'm watching you.
        try{
            reportFile.open("report.txt", ios::out | ios::app);
            reportFile << targets[tt] << "\n";
            reportFile.close();
        }
        catch(exception& e){
            cout << "An exception" << e.what() << "has occurred." << endl;
        }
    }
}

void ntFormat(){
    /// Declare vectors for storage of information
    vector<string> updaters;
    vector<string> targets;

    /// Declare loop counters
    int numOfUpdaters;
    int numOfTargets;

    /// Declare filestream
    ofstream reportFile;

    /// Set that counter
    cout << "Please enter the number of people at update: ";
    cin >> numOfUpdaters;

    /// Enter loop to collect updater information and push it into the vector
    for (int ii = 0; ii < numOfUpdaters; ii++) {
        string updaterName;
        cout << "Enter nation of updater. Replace spaces with underscores: ";
        cin >> updaterName;
        updaters.push_back(updaterName);
    }

    /**
     * This loop here is for testing purposes **only**. Make sure to comment
     * out once finished testing.
     *
     * If you are reading this code and looking for tools to debug this
     * because you downloaded the source, and broke it, please download
     * the binary and try again, this time without fiddling with anything.
     * This program is super simple, I don't know how you broke it.
     *
     * If you're still trying to debug it, you may as well uncomment this loop
     * and see if you can figure out anything with it that way, it can't
     * hurt, can it.
     */

    /**for(int tt = 0; tt < updaters.size(); tt++){
    *    cout << updaters[tt] << endl;
    * }
    */

    /// Get number of targets
    cout << "Please enter the number of total hits: ";
    cin >> numOfTargets;

    /// Enter loop to collect target information and push it into the vector
    for (int kk = 0; kk < numOfTargets; kk++) {
        /**
         * Fuck you. Yes, I got exceptions on this. Yes,
         * my response to getting exceptions was just
         * "oh I'll wrap it in a try/catch."
         * Fuck you future developer trying to maintain
         * this despite not knowing what exceptions
         * I was getting on a standard input/output
         * loop. The world will never know.
         */
        try{
            string targetName;
            cout << "Enter name of target, replace space with underscore: ";
            cin >> targetName;
            targets.push_back(targetName);
        }
        catch(exception& e){
            cout << "An exception " << e.what() << "has occured." << endl;
        }
    }
    reportFile.open("report.txt", ios::out | ios::app);
    reportFile << "Number of Updaters: " << numOfUpdaters << "\n";
    reportFile << "Who Updated: \n";
    reportFile.close();
    for (int uu = 0; uu < updaters.size(); uu++) {

        /// Fuck you, exceptions.
        try{
            reportFile.open("report.txt", ios::out | ios::app);
            reportFile << "[nation]" << updaters[uu] << "[/nation]" << "\n";
            reportFile.close();
        }
        catch(exception& e){
            cout << "An error " << e.what() << "has occured." << endl;
        }
    }
    reportFile.open("report.txt", ios::out | ios::app);
    reportFile << "Targets Hit: " << numOfTargets << "\n";
    reportFile << "Targets: " << "\n";
    reportFile.close();
    for (int tt = 0; tt < targets.size(); tt++){

        /// Don't even fucking try. I'm watching you.
        try{
            reportFile.open("report.txt", ios::out | ios::app);
            reportFile << "https://nationstates.net/region=" << targets[tt] << "\n";
            reportFile.close();
        }
        catch(exception& e){
            cout << "An exception" << e.what() << "has occurred." << endl;
        }
    }
}

void tnnFormat(){

    /// Variable declaration
    vector<string> targets;
    int numTargs;

    /// Get loop control info
    cout << "Enter number of targets: ";
    cin >> numTargs;

    /// Get targets
    for(int ii = 0; ii < numTargs; ii++){
        string targName;
        cout << "Enter target name, replace spaces with underscores: ";
        cin >> targName;
        targets.push_back(targName);
    }

    /// Open filestream
    ofstream reportFile;

    /// Open file
    try{
        reportFile.open("report.txt", ios::out | ios::app);
    }
    catch(exception& e){
        cout << "Error, exception " << e.what() << "occured while attempting to open the file.";
    }

    /// Output to file loop
    for(int kk = 0; kk < targets.size(); kk++){
        reportFile << "https://nationstates.net/region=" << targets[kk] << "\n";
    }

    /// Close filestream
    reportFile.close();

}

void tnrFormat(){

    /// Initialize vectors
    vector<string> names;
    vector<string> ranks;
    vector<string> targets;

    /// Initialize loop control variables
    int nLoop;
    int tLoop;

    /// Get loop control information
    cout << "Enter number of updaters: ";
    cin >> nLoop;
    cout << "Enter number of targets: ";
    cin >> tLoop;

    /// Start name & rank loop
    for(int ii = 0; ii < nLoop; ii++){
        string nation;
        string rank;
        cout << "Updater nation. Replace spaces with underscores: ";
        cin >> nation;
        cout << "Updater rank. Replace spaces with underscores: ";
        cin >> rank;
        names.push_back(nation);
        ranks.push_back(rank);
    }

    /// Start target loop
    for(int tt = 0; tt < tLoop; tt++){
        string target;
        cout << "Enter target. Replace spaces with underscores: ";
        cin >> target;
        targets.push_back(target);
    }

    /// Initialize filestream
    ofstream reportFile;

    /// Open report file
    reportFile.open("report.txt", ios::out | ios::app);

    /// Output updaters to file, but first add a heading
    reportFile << "Updaters:" << "\n";

    for(int kk = 0; kk < names.size(); kk++){
       reportFile << ranks[kk] << ": https://nationstates.net/nation=" << names[kk] << "\n";
    }

    /// Output targets to file, but first add a heading
    reportFile << "Targets:" << "\n";
    for(int uu = 0; uu < targets.size(); uu++){
        reportFile << "https://nationstates.net/region=" << targets[uu] << "\n";
    }

    /// Close filestream, clean up properly
    reportFile.close();
}
