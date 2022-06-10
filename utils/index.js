

export const countCheckedCheckBoxItems = (list) => {
    const checkedItems = list.filter(item => JSON.parse(item).isChecked);

    return { length: checkedItems.length, items: checkedItems };
}