import { INPUT, CHECKBOX } from "../../constants";
import { isEveryValueMissing, ruleValidateGenericString } from "service/utils";
import ExpressionParser from "service/ExpressionParser";
import { renderTarget } from "service/utils";
import { getCounter } from "service/screenshotCounter";

export const screenshot = {
  template: ({ target, params, id }) => {
    const { name, omitBackground } = params,
          parser = new ExpressionParser( id ),
          baseOptions = {
            omitBackground
          },
          options = baseOptions,

          optArg = isEveryValueMissing( options ) ? ` ` : `, ${ JSON.stringify( options ) } `;
    return `
      // Taking screenshot of ${ target } element
      await ( ${ renderTarget( target ) } ).`
        + `screenshot( util.png( ${ JSON.stringify( id ) }, ${ parser.stringify( name ) }${ optArg }) );
  `;
  },

  toLabel: ({ params }) => `(\`${ params.name }\`)`,
  commonly: "make screenshot",

  toGherkin: ({ target, params }) => `Take screenshot \`${ params.name }\` of \`${ target }\``,

  description: `Takes a screenshot of the target element.`,


  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          template: true,
          control: INPUT,
          label: "Description",
          tooltip: `The description is a plain text, which will be normalized to screenshot file name.
              Slashes can be used to set file location: 'foo/bar/baz'.`,
          placeholder: "e.g. The form is just submitted",
          initialValue: ( record ) => `Element ${ getCounter( record.id ) || "" }`,
          rules: [{
            required: true,
            message: "Screenshot description required"
          },
          {
            validator: ruleValidateGenericString
          },
          {
            transform: ( value ) => value.trim()
          }]
        },
        {
          name: "params.omitBackground",
          label: "omit background",
          control: CHECKBOX ,
          tooltip: `Hides default white background and allows capturing screenshots with transparency.`,
          initialValue: false,
          placeholder: "",
          rules: []
        }
      ]
    }

  ],

  testTypes: {
    "params": {
      "name": "INPUT",
      "omitBackground": "CHECKBOX"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "name": "Element 1",
        "omitBackground": false
      }
    }
  ]
};
