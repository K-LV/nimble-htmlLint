//Index 0 returns human-readable message
//Index 1 returns start character of the error
//Index 2 returns end character of the error
//Index 3 returns the start line number
//Index 4 returns the end line number
//Index 5 returns the output of the error

define(function(require){
    function parser(input) {
        var parse = require("slowparse/slowparse");
        var result = parse.HTML(document, input);
        var msg = []; 
        var output = "";  

        if(result.error){
            var obj = result.error;
            var lineCount = 1;
            var lineBeginStart = 0;
            var lineBeginEnd = 0;
            var parsedText; 
            var charCount = 0;
            var errorJSON = {
                "ATTRIBUTE_IN_CLOSING_TAG": "<p>The closing <code>&lt;/{{ error }}&gt;</code> tag cannot contain any attributes.</p>",
                "CLOSE_TAG_FOR_VOID_ELEMENT": "<p>The closing <code>&lt;/{{ error }}&gt;</code> tag is for a void element (that is, an element that doesn't need to be closed).</p>",
                "CSS_MIXED_ACTIVECONTENT": "<p>The css property has a url() value that currently points to an insecure resource. You can make this error disappear by logging into webmaker. For more information on how modern browsers signal insecure content, visit <a href='https://developer.mozilla.org/en-US/docs/Security/MixedContent'>this link</a>.</p>",
                "EVENT_HANDLER_ATTR_NOT_ALLOWED": "<p>Sorry, but security restrictions on this site prevent you from using the JavaScript event handler attribute. If you really need to use JavaScript, consider using <a href='http://jsbin.com/'>jsbin</a> or <a href='http://jsfiddle.net/'>jsfiddle</a>.</p>",
                "HTML_CODE_IN_CSS_BLOCK": "<p>HTML code was detected in CSS context</p>",
                "HTTP_LINK_FROM_HTTPS_PAGE": "<p>The <code>&lt;{{ error }}&gt;</code> tag's <code>{{ error1 }}</code> attribute currently points to an insecure resource. You can make this error disappear by logging into webmaker. For more information on how modern browsers signal insecure content, visit <a href='https://developer.mozilla.org/en-US/docs/Security/MixedContent'>this link</a>.</p>",
                "INVALID_ATTR_NAME": "<p>The attribute has a name that is not permitted under HTML5 naming conventions.</p>",
                "UNSUPPORTED_ATTR_NAMESPACE": "<p>The attribute uses an attribute namespace that is not permitted under HTML5 conventions.</p>",
                "MULTIPLE_ATTR_NAMESPACES": "<p>The attribute has multiple namespaces. Check your text and make sure there's only a single namespace prefix for the attribute.</p>",
                "INVALID_CSS_DECLARATION": "<p>This CSS declaration never closes.</p>",
				"INVALID_CSS_PROPERTY_NAME": "<p>CSS property <em>{{ error }}</em> does not exist. You may want to see a <a href='https://developer.mozilla.org/en/CSS/CSS_Reference'>list of CSS properties</a>.</p>",
                "INVALID_CSS_RULE": "<p>This CSS rule is not legal CSS.</p>",
                "INVALID_TAG_NAME": "<p>The <code>&lt;</code> character appears to be the beginning of a tag, but is not followed by a valid tag name.</p> <p>If you just want a <code>&lt;</code> to appear on your Web page, try using <code>&amp;lt;</code> instead.</p> <p>Or, see a <a href='https://developer.mozilla.org/en/docs/Web/Guide/HTML/HTML5/HTML5_element_list'>list of HTML5 tags</a>.</p>",
                "JAVASCRIPT_URL_NOT_ALLOWED": "<p>Sorry, but security restrictions on this site prevent you from using the <code>javascript:</code> URL. If you really need to use JavaScript, consider using <a href='http://jsbin.com/'>jsbin</a> or <a href='http://jsfiddle.net/'>jsfiddle</a>.</p>",
                "MISMATCHED_CLOSE_TAG": "<p>The closing <code>&lt;/{{ error }}&gt;</code> tag doesn't pair with the opening <code>&lt;{{ error1 }}&gt;</code> tag. This is likely due to a missing or misplaced <code>&lt;/{{ error1 }}&gt;</code> tag.",
				"MISSING_CSS_BLOCK_CLOSER": "<p>Missing block closer or next property:value; pair following <em>{{ error }}</em>.</p>",
                "MISSING_CSS_BLOCK_OPENER": "<p>Missing block opener after <em>{{ error }}</em>.</p>",
                "MISSING_CSS_PROPERTY": "<p>Missing property for <em>{{ error }}</em>.</p>",
                "MISSING_CSS_SELECTOR": "<p>Missing either a new CSS selector or the &lt;/style&gt; tag.</p>",
                "MISSING_CSS_VALUE": "<p>Missing value for <em>{{ error }}</em>.</p>",
                "SCRIPT_ELEMENT_NOT_ALLOWED": "<p>Sorry, but security restrictions on this site prevent you from using <code>&lt;script&gt;</code> tags. If you really need to use JavaScript, consider using <a href='http://jsbin.com/'>jsbin</a> or <a href='http://jsfiddle.net/'>jsfiddle</a>.</p>",
                "SELF_CLOSING_NON_VOID_ELEMENT": "<p>The <code>&lt;{{ error }}&gt;</code> tag can't be self-closed, because <code>&lt;{{ error }}&gt;</code> is not a void element; it must be closed with a separate <code>&lt;/{{ error }}&gt;</code> tag.</p>",
                "UNCAUGHT_CSS_PARSE_ERROR": "<p>A parse error occurred outside expected cases: <em>{{ error }}</em></p>",
                "UNCLOSED_TAG": "<p>The <code>&lt;{{ error }}&gt;</code> tag never closes.</p>",
				"UNEXPECTED_CLOSE_TAG": "<p>The closing <code>&lt;/{{ error }}&gt;</code> tag doesn't pair with anything, because there are no opening tags that need to be closed.</p>",
                "UNFINISHED_CSS_PROPERTY": "<p>Property <em>{{ error }}</em> still needs finalizing with :</p>",
                "UNFINISHED_CSS_SELECTOR": "<p>Selector <em>{{ error }}</em> still needs finalizing with {</p>",
                "UNFINISHED_CSS_VALUE": "<p>Value <em>{{ error }}</em> still needs finalizing with ;</p>",
                "UNKOWN_CSS_KEYWORD": "<p>The CSS @keyword <em>{{ error }}</em> does not match any known @keywords.</p>",
                "UNQUOTED_ATTR_VALUE": "<p>The Attribute value should start with an opening double quote.</p>",
                "UNTERMINATED_ATTR_VALUE": "<p>The <code>&lt;{{ error }}&gt;</code> tag's <code>{{ error1 }}</code> attribute has a value that doesn't end with a closing double quote.</p>",
                "UNTERMINATED_CLOSE_TAG": "<p>The closing <code>&lt;/{{ error }}&gt;</code> tag doesn't end with a <code>&gt;</code>.</p>",
                "UNTERMINATED_COMMENT": "<p>The comment doesn't end with a <code>--&gt;</code>.</p>",
                "UNTERMINATED_CSS_COMMENT": "<p>The CSS comment doesn't end with a <code>*/</code>.</p>",
                "UNBOUND_ATTRIBUTE_VALUE": "<p>The attribute value <code>{{ error }}</code> appears to be detached from an attribute. You may be missing an '=' sign.</p>",
                "UNTERMINATED_OPEN_TAG": "<p>The opening <code>&lt;{{ error }}&gt;</code> tag doesn't end with a <code>&gt;</code>.</p>"
            };
            //human-readable msg, start, and end of error based on error type
            if (obj.type === "ATTRIBUTE_IN_CLOSING_TAG"){
                msg[0] = Mustache.render(errorJSON.ATTRIBUTE_IN_CLOSING_TAG, { 'error': obj.closeTag.name });
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "CLOSE_TAG_FOR_VOID_ELEMENT"){
                msg[0] = Mustache.render(errorJSON.CLOSE_TAG_FOR_VOID_ELEMENT, { 'error': obj.closeTag.name });
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "CSS_MIXED_ACTIVECONTENT"){
                msg[0] = errorJSON.CSS_MIXED_ACTIVECONTENT;
                msg[1] = obj.cssProperty.start;
                msg[2] = obj.cssProperty.end;
            }
            if (obj.type === "EVENT_HANDLER_ATTR_NOT_ALLOWED"){
                msg[0] = errorJSON.EVENT_HANDLER_ATTR_NOT_ALLOWED;
            }
            if (obj.type === "HTML_CODE_IN_CSS_BLOCK"){
                msg[0] = errorJSON.HTML_CODE_IN_CSS_BLOCK;
                msg[1] = obj.html.start;
                msg[2] = obj.html.end;
            }
            if (obj.type === "HTTP_LINK_FROM_HTTPS_PAGE"){ 
                msg[0] = Mustache.render(errorJSON.HTTP_LINK_FROM_HTTPS_PAGE, { 'error': obj.openTag.name, 'error1': obj.attribute.name.value });
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
            if (obj.type === "INVALID_ATTR_NAME"){
                msg[0] = errorJSON.INVALID_ATTR_NAME;
                msg[1] = obj.start;
                msg[2] = obj.end;
            }
            if (obj.type === "UNSUPPORTED_ATTR_NAMESPACE"){
                msg[0] = errorJSON.UNSUPPORTED_ATTR_NAMESPACE;
                msg[1] = obj.start;
                msg[2] = obj.end;
            }
            if (obj.type === "MULTIPLE_ATTR_NAMESPACES"){
                msg[0] = errorJSON.MULTIPLE_ATTR_NAMESPACES;
                msg[1] = obj.start;
                msg[2] = obj.end;
            }
            if (obj.type === "INVALID_CSS_DECLARATION"){
                msg[0] = errorJSON.INVALID_CSS_DECLARATION;
            }
            if (obj.type === "INVALID_CSS_PROPERTY_NAME"){
                msg[0] = Mustache.render(errorJSON.INVALID_CSS_PROPERTY_NAME, { 'error': obj.cssProperty.property });
                msg[1] = obj.cssProperty.start;
                msg[2] = obj.cssProperty.end;
            }
            if (obj.type === "INVALID_CSS_RULE"){
                msg[0] = errorJSON.INVALID_CSS_RULE;
            }
            if (obj.type === "INVALID_TAG_NAME"){
                msg[0] = errorJSON.INVALID_TAG_NAME;
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
            if (obj.type === "JAVASCRIPT_URL_NOT_ALLOWED"){
                msg[0] = errorJSON.JAVASCRIPT_URL_NOT_ALLOWED;
            }
            if (obj.type === "MISMATCHED_CLOSE_TAG"){
                msg[0] = Mustache.render(errorJSON.MISMATCHED_CLOSE_TAG, { 'error': obj.closeTag.name, 'error1': obj.openTag.name });
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "MISSING_CSS_BLOCK_CLOSER"){
                msg[0] = Mustache.render(errorJSON.MISSING_CSS_BLOCK_CLOSER, { 'error': obj.cssValue.value });
                msg[1] = obj.cssValue.start;
                msg[2] = obj.cssValue.end;
            }
            if (obj.type === "MISSING_CSS_BLOCK_OPENER"){
                msg[0] = Mustache.render(errorJSON.MISSING_CSS_BLOCK_OPENER, { 'error': obj.cssSelector.selector });
                msg[1] = obj.cssSelector.start;
                msg[2] = obj.cssSelector.end;
            }
            if (obj.type === "MISSING_CSS_PROPERTY"){
                msg[0] = Mustache.render(errorJSON.MISSING_CSS_PROPERTY, { 'error': obj.cssSelector.selector});
                msg[1] = obj.cssSelector.start;
                msg[2] = obj.cssSelector.end;
            }
            if (obj.type === "MISSING_CSS_SELECTOR"){
                msg[0] = errorJSON.MISSING_CSS_SELECTOR;
                msg[1] = obj.cssBlock.start;
                msg[2] = obj.cssBlock.end;
            }
            if (obj.type === "MISSING_CSS_VALUE"){
                msg[0] = Mustache.render(errorJSON.MISSING_CSS_VALUE, { 'error': obj.cssProperty.property});
                msg[1] = obj.cssProperty.start;
                msg[2] = obj.cssProperty.end;
            }
            if (obj.type === "SCRIPT_ELEMENT_NOT_ALLOWED"){
                msg[0] = errorJSON.SCRIPT_ELEMENT_NOT_ALLOWED;
            }
            if (obj.type === "SELF_CLOSING_NON_VOID_ELEMENT"){
                msg[0] = Mustache.render(errorJSON.SELF_CLOSING_NON_VOID_ELEMENT, { 'error': obj.error.name});
                msg[1] = obj.start;
                msg[2] = obj.end;
            }
            if (obj.type === "UNCAUGHT_CSS_PARSE_ERROR"){
                msg[0] = Mustache.render(errorJSON.UNCAUGHT_CSS_PARSE_ERROR, { 'error': obj.error.msg});
                msg[1] = obj.error.start;
                msg[2] = obj.error.end;
            }
            if (obj.type === "UNCLOSED_TAG"){
                msg[0] = Mustache.render(errorJSON.UNCLOSED_TAG, { 'error': obj.openTag.name});
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
            if (obj.type === "UNEXPECTED_CLOSE_TAG"){
                msg[0] = Mustache.render(errorJSON.UNEXPECTED_CLOSE_TAG, { 'error': obj.closeTag.name });
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "UNFINISHED_CSS_PROPERTY"){
                msg[0] = Mustache.render(errorJSON.UNFINISHED_CSS_PROPERTY, { 'error': obj.cssProperty.property });
                msg[1] = obj.cssProperty.start;
                msg[2] = obj.cssProperty.end;
            }
            if (obj.type === "UNFINISHED_CSS_SELECTOR"){
                msg[0] = Mustache.render(errorJSON.UNFINISHED_CSS_SELECTOR, { 'error': obj.cssSelector.selector });
                msg[1] = obj.cssSelector.start;
                msg[2] = obj.cssSelector.end;
            }
            if (obj.type === "UNFINISHED_CSS_VALUE"){
                msg[0] = Mustache.render(errorJSON.UNFINISHED_CSS_VALUE, { 'error': obj.cssValue.value });
                msg[1] = obj.cssValue.start;
                msg[2] = obj.cssValue.end;
            }
            if (obj.type === "UNKOWN_CSS_KEYWORD"){
                msg[0] = Mustache.render(errorJSON.UNKOWN_CSS_KEYWORD, { 'error': obj.cssKeyword.value });
                msg[1] = obj.cssKeyword.start;
                msg[2] = obj.cssKeyword.end;
            }
            if (obj.type === "UNQUOTED_ATTR_VALUE"){
                msg[0] = errorJSON.UNQUOTED_ATTR_VALUE;
                msg[1] = obj.start;
                msg[2] = obj.start;
            }
            if (obj.type === "UNTERMINATED_ATTR_VALUE"){
                msg[0] = Mustache.render(errorJSON.UNTERMINATED_ATTR_VALUE, { 'error': obj.openTag.name, 'error1': obj.attribute.name.value });
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
            if (obj.type === "UNTERMINATED_CLOSE_TAG"){
                msg[0] = Mustache.render(errorJSON.UNTERMINATED_CLOSE_TAG, { 'error': obj.closeTag.name });
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "UNTERMINATED_COMMENT"){
                msg[0] = errorJSON.UNTERMINATED_COMMENT;
                msg[1] = obj.start;
                msg[2] = obj.start;
            }
            if (obj.type === "UNTERMINATED_CSS_COMMENT"){
                msg[0] = errorJSON.UNTERMINATED_CSS_COMMENT;
                msg[1] = obj.start;
                msg[2] = obj.start;
            }
            if (obj.type === "UNBOUND_ATTRIBUTE_VALUE"){
                msg[0] = Mustache.render(errorJSON.UNBOUND_ATTRIBUTE_VALUE, { 'error': obj.value });
                msg[1] = obj.interval.start;
                msg[2] = obj.interval.end;
            }
            if (obj.type === "UNTERMINATED_OPEN_TAG"){
                msg[0] = Mustache.render(errorJSON.UNTERMINATED_OPEN_TAG, { 'error': obj.openTag.name });
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
	        for(var i = msg[1]; i <= msg[2]; i++){
	            output += input[i];
	        }
	        msg[5] = output;

            //Finds the line number for the start of the error
            for(var i = 0; i <= (msg[1] + 1); i++)
            {
                if(input[i] === "\n")
                {
                    lineCount += 1;
                    lineBeginStart = i;
                }
                parsedText += input[i];
                charCount++;
            }
            //line number for start of error
            msg[3] = lineCount;

            ////Finds the line number for the end of the error
            for(var i = (msg[1] + 1); i <= (msg[2] + 1); i++)
            {
                if(input[i] === "\n")
                {
                    lineCount += 1;
                    lineBeginEnd = i;
                }
                parsedText += input[i];
                charCount++;
            }
            //character relative to start of the line
            msg[1] = msg[1] - lineBeginStart
            msg[2] = msg[2] - lineBeginEnd;
            
            //line number for end of error
            msg[4] = lineCount;
        }
       return msg;
    }

    return parser;
});