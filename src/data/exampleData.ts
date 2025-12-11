import type {StoreType} from "./localDataStore.ts";
import {v7 as uuidv7} from 'uuid';

const exampleDeckId = uuidv7();

export const exampleData: StoreType = {
    decks: [{
        id: exampleDeckId,
        name: 'Example Deck',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }],
    cards: [{
        id: uuidv7(),
        deckId: exampleDeckId,
        front: "Conceptually, how do “receiving application” (MSH-5) and “receiving facility” (MSH-6) differ?",
        back: "MSH-5 – Receiving application: the target system that should receive/consume the message.\n" +
            "MSH-6 – Receiving facility: the organization or site that owns that receiving application instance.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        streak: 0,
        intervalDays: 0,
        nextReviewAt: new Date().toISOString(),
    },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "Conceptually, how do “sending application” (MSH-3) and “sending facility” (MSH-4) differ?",
            back: "MSH-3 – Sending application: the software/application instance sending the message (e.g., LABLIS).\n" +
                "MSH-4 – Sending facility: the organization or site the application represents (e.g., MAINHOSPITAL).",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "Describe the components of the message type field (MSH-9).",
            back: "<Message code> ^ <Trigger event> ^ <Message structure>\n" +
                "Example: ADT^A01^ADT_A01",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "How are Z-segments named, and what are they used for?",
            back: "Z-segments are locally defined extension segments whose names start with “Z” (e.g., ZBX).\n" +
                "They are used to carry site-specific data not covered by the base standard.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "In an HL7 v2 message, how are segments separated from one another?",
            back: "Segments are separated by a carriage return (CR) character.\n" +
                "Example: MSH...<CR>PID...<CR>PV1...<CR>",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "In MSH-9, what is the relationship between the message code and the trigger event? Give an example.",
            back: "The message code describes the general type of interaction (e.g., ADT, ORM, ORU, ACK).\n" +
                "The trigger event describes why the message was sent (e.g., A01 admit, R01 result).\n" +
                "Example: ADT^A01 – an ADT message triggered by an A01 (admit/visit notification) event.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "List, in order, the default characters in MSH-2 (encoding characters).",
            back: "^ – Component separator\n" +
                "~ – Repetition separator\n" +
                "\\ – Escape character\n" +
                "& – Subcomponent separator",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What are the required fields in an MSH segment in HL7 v2.8?",
            back: "MSH-1 – Field separator\n" +
                "MSH-2 – Encoding characters\n" +
                "MSH-7 – Date/Time of message\n" +
                "MSH-9 – Message type\n" +
                "MSH-10 – Message control ID\n" +
                "MSH-11 – Processing ID\n" +
                "MSH-12 – Version ID",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What character is used to indicate repeating values within a single field? Give an example.",
            back: "The repetition separator is \"~\".\n" +
                "Example: two phone numbers in a repeating telecom field:\n" +
                "^PRN^PH^^^555^1234~^ORN^CP^^^555^9999",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What constraints exist on the choice of delimiter characters in an HL7 message?",
            back: "They must be printable from the allowed set, must not appear unescaped in data, and all communicating systems must agree on them (as defined in MSH-1 and MSH-2).",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What is the purpose of MSH-1, and where is it physically located in the message?",
            back: "MSH-1 is the field separator. It is the single character immediately after \"MSH\".\n" +
                "Example: MSH|^~\\&|... (here, \"|\" is MSH-1).",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What is the purpose of the escape character, and give one example of an escape sequence.",
            back: "The escape character \"\\\" allows delimiter characters to appear in data fields using escape sequences.\n" +
                "Examples:\n" +
                "\\F\\ – literal field separator (|)\n" +
                "\\S\\ – literal component separator (^)\n" +
                "\\R\\ – literal repetition separator (~)",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What is the third component of MSH-9, and why was it added?",
            back: "The third component is the message structure (e.g., ADT_A01).\n" +
                "It explicitly identifies the structure definition (segment order, required/optional segments), since multiple trigger events can share the same structure.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What MSH field indicates how the message should be processed (e.g., production vs test), and what are the usual values?",
            back: "MSH-11 – Processing ID.\n" +
                "Common values:\n" +
                "P – Production\n" +
                "T – Training\n" +
                "D – Debug/debugging/test",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What MSH field indicates the HL7 version being used, and why is it important?",
            back: "MSH-12 – Version ID.\n" +
                "It tells the receiver which HL7 v2 version (e.g., 2.3, 2.5, 2.8) the message follows, affecting segment definitions, data types, and requirements.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What MSH field indicates the message type?",
            back: "MSH-9 – Message type.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What MSH fields indicate the receiving application and receiving facility?",
            back: "MSH-5 – Receiving application\n" +
                "MSH-6 – Receiving facility",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "What MSH fields indicate the sending application and sending facility?",
            back: "MSH-3 – Sending application\n" +
                "MSH-4 – Sending facility",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "Which character is the default truncation character in HL7 v2, and what is it used for?",
            back: "# – It is the truncation character, indicating that the data has been deliberately cut off at that point (e.g., because of length limits).",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "Which characters in an HL7 v2 message are considered delimiters/encoding characters?",
            back: "Field separator – usually | (MSH-1)\n" +
                "Component separator – ^\n" +
                "Repetition separator – ~\n" +
                "Escape character – \\\n" +
                "Subcomponent separator – &\n" +
                "(Plus, truncation character – default # – as an additional encoding character)",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        },
        {
            id: uuidv7(),
            deckId: exampleDeckId,
            front: "Which MSH field is used to uniquely identify a message, and what property must it have?",
            back: "MSH-10 – Message control ID.\n" +
                "It must be unique (within the sending system’s namespace) so receivers can detect duplicates and match acknowledgments.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streak: 0,
            intervalDays: 0,
            nextReviewAt: new Date().toISOString(),
        }],
};
