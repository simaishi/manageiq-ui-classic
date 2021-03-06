import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controlled as CodeMirror } from 'react-codemirror2';
import {
  FormGroup,
  ControlLabel,
  Radio,
  HelpBlock,
} from 'patternfly-react';

// editor modes
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/yaml/yaml';
// editor help
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';

import RequiredLabel from '../../forms/required-label';

const getMode = mode => ({
  json: { name: 'javascript', json: true },
})[mode] || mode;

const CodeEditor = ({
  mode,
  modes,
  hasError,
  onChange,
  ...props
}) => {
  const [codeMode, setCodeMode] = useState(mode);
  const [value, setValue] = useState();
  const [editor, setEditor] = useState();
  useEffect(() => {
    setValue(props.value);
    if (editor) {
      editor.refresh();
    }
  }, [editor]);
  return (
    <div>
      {modes.length > 0 && (
        <FormGroup controlId="radioGroup" disabled={false}>
          <div>
            {modes.map(mode => <Radio checked={codeMode === mode} onChange={() => setCodeMode(mode)} inline key={mode} name={mode}>{mode}</Radio>)}
          </div>
        </FormGroup>
      )}
      <CodeMirror
        className={`miq-codemirror ${hasError ? 'has-error' : ''}`}
        options={{
          mode: getMode(codeMode),
          theme: 'eclipse',
          lint: true,
          lineNumbers: true,
          lineWrapping: true,
          autoCloseBrackets: true,
          styleActiveLine: true,
          gutters: ['CodeMirror-lint-markers'],
        }}
        style={{ height: 'auto' }}
        onBeforeChange={(editor, _data, value) => {
          setValue(value);
        }}
        onChange={(editor, _data, value) => {
          onChange(editor, _data, value);
        }}
        editorDidMount={(editor) => {
          setEditor(editor);
        }}
        {...props}
        value={value}
      />
    </div>
  );
};

CodeEditor.propTypes = {
  mode: PropTypes.oneOf(['json', 'yaml']),
  modes: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

CodeEditor.defaultProps = {
  mode: 'yaml',
  modes: [],
};

export const DataDrivenFormCodeEditor = ({
  FieldProvider,
  ...props
}) => (
  <FieldProvider {...props}>
    {({
      input: { value, onChange, name },
      meta: { error },
      formOptions: _formOptions,
      label,
      isRequired,
      ...props
    }) => (
      <FormGroup name={name} validationState={error && 'error'}>
        <ControlLabel>
          {isRequired ? <RequiredLabel label={label} /> : label }
        </ControlLabel>
        <CodeEditor
          onChange={(_editor, _data, value) => onChange(value)}
          value={value}
          hasError={!!error}
          {...props}
        />
        {error && <HelpBlock>{error}</HelpBlock>}
      </FormGroup>
    )}
  </FieldProvider>
);

export default CodeEditor;
