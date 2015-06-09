 /* The MIT License (MIT)
 *  
 * Copyright (c) 2015 VIMOC Technologies
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */////////////////////////////////////////////////////////////////////////////////


 

var Query = React.createClass({
    
    mixins: [
        traceMixIn     //uses log()
    ],  

    
    getDefaultProps: function() {
        return {
            params: []
        }
    },


    render: function(){
        this.trace('rendering query....') ;
        var divid = this.props.guid+'-query'
        
        var params = '' ;
        if (this.props.params.length>0) {
             params = this.props.params.join(', ')
        }

        return (
          <DivWrapper key={divid}>
            <table className="table table-hover"><tbody>
            <RowItemWrapper key="1" value={['type:',this.props.type]}/>
            <RowItemWrapper key="2" value={['queryId:',this.props.queryId]}/>
            <RowItemWrapper key="3" value={['description',this.props.description]}/>
            <RowItemWrapper key="4" value={['parameters:',params]}/>
            </tbody></table>
          </DivWrapper>
        ) ;
  }
});