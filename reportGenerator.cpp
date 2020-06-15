#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include "generate.h"

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

    /**
     * Mode selection. There are multiple modes for the
     * generator to use, and which one will be used depends on the
     * selection given here.
     */
    /// Declare variables for selection purposes
    int modeSelector;
    cout << "Choose mode of operation:" << endl;
    cout << "1) No formatting" << endl;
    cout << "2) Nation and Target formatting" << endl;
    cout << "3) Target formatting, no nations supplied" << endl;
    cout << "4) Target formatting, Nation formatting, ranks" << endl;
    //cout << "5) All options of 4 + org credits" << endl;
    cin >> modeSelector;

    /// Execute different modes based on input
    if(modeSelector == 1){
        noFormat();
    }
    else if(modeSelector == 2){
        ntFormat();
    }
    else if(modeSelector == 3){
        tnnFormat();
    }
    else if(modeSelector == 4){
        tnrFormat();
    }
    /*else if(modeSelector == 5){
        tnroFormat();
    }*/
}
