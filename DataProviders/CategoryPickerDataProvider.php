<?php

namespace MageSuite\ContentConstructorAdmin\DataProviders;

class CategoryPickerDataProvider
{
    /**
     * @var \MageSuite\ContentConstructorFrontend\DataProviders\NavigationDataProvider
     */
    private $navigationDataProvider;

    public function __construct(\MageSuite\ContentConstructorFrontend\DataProviders\NavigationDataProvider $navigationDataProvider)
    {
        $this->navigationDataProvider = $navigationDataProvider;
    }

    public function getCategories($rootCategoryId) {
        $categories = $this->navigationDataProvider->getNavigationStructure($rootCategoryId, false);

        $modifiedCategories['optgroup'] = $categories['items'];

        $this->modifyKeys($modifiedCategories['optgroup']);

        return $modifiedCategories;
    }

    public function modifyKeys(&$categories) {
        foreach($categories as &$category) {
            $category['value'] = $category['id'];
            unset($category['id']);
            unset($category['hasChildren']);

            if(isset($category['subcategories'])) {
                $category['optgroup'] = $category['subcategories'];
                unset($category['subcategories']);

                $this->modifyKeys($category['optgroup']);
            }
        }
    }
}