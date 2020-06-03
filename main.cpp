#include <iostream>
#include <fstream>
#include <vector>
#include <string>

using namespace std;

int main() {

    /// Declare filestream
    ofstream reportFile;

    /** We don't do anything with the report file yet
     * we just want to initialize it up here along with
     * the rest of the variables for cleaner tracking of
     * all things involved. The only variables that aren't
     * clearly defined up here are single use throwaway
     * variables created in a loop for the purposes of
     * handling a vector.
     */

    /// Declare vectors for storage of information
    vector<string> updaters;
    vector<string> targets;

    /// Declare loop counters
    int numOfUpdaters;
    int numOfTargets;

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
                reportFile << "https://nationstates.net/region=" << targets[tt] << "\n";
                reportFile.close();
        }
        catch(exception& e){
            cout << "An exception" << e.what() << "has occurred." << endl;
        }
    }
}
