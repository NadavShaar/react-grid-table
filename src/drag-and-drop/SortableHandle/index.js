import * as React from "react";

import { provideDisplayName } from "../utils";

export default function sortableHandle(WrappedComponent) {
    return class WithSortableHandle extends React.Component {
        static displayName = provideDisplayName(
            "sortableHandle",
            WrappedComponent
        );

        componentDidMount() {
            this.wrappedInstance.current.sortableHandle = true;
        }

        getWrappedInstance() {
            return this.wrappedInstance.current;
        }

        wrappedInstance = React.createRef();

        render() {
            return (
                <WrappedComponent ref={this.wrappedInstance} {...this.props} />
            );
        }
    };
}

export function isSortableHandle(node) {
    return node.sortableHandle != null;
}
