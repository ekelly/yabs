import { BillState, selectContributionPerPerson } from "../context/BillContext";

const DEFAULT_DESCRIPTION = "our recent shared purchase";

export const generateOutputString = (state: BillState, id?: string) => {
    // If id is provided, we are outputting for a single person.
    // If it is not provided, we are outputting everyone
    let desc = state.description ? state.description : DEFAULT_DESCRIPTION;
    let outputString = `Bill splitting totals for ${desc}:`;

    selectContributionPerPerson(state)
        .filter(personContribution => !!id ? id === personContribution.id : true)
        .forEach((personContribution) => {
            outputString += `\n${personContribution.name}: $${personContribution.personTotal}`;
        });
    
    return outputString;
};