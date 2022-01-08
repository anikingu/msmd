const InteractionStep = (target, action, input) => {
    const interactive = {
        target: target,
        action: action,
        input: input
    };
    return interactive;
}

const DirectiveStep = ({type, subtype, detail}) => {
    const directive = {
        type: type,
        subtype: subtype,
        detail: detail
    };
    return directive;
}

const StepType = {
    INTERACTION: InteractionStep,
    DIRECTIVE: DirectiveStep,
}

const InteractionAction = {
    CLICK: 'click',
    CHANGE: 'change'
}

export {StepType, InteractionAction};