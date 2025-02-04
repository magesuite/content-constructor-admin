<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\DataProviders;

class CategoryPickerDataProvider
{
    protected \MageSuite\ContentConstructorFrontend\DataProviders\NavigationDataProvider $navigationDataProvider;

    public function __construct(\MageSuite\ContentConstructorFrontend\DataProviders\NavigationDataProvider $navigationDataProvider)
    {
        $this->navigationDataProvider = $navigationDataProvider;
    }

    public function getCategories(int $rootCategoryId): array
    {
        $categories = $this->navigationDataProvider->getNavigationStructure($rootCategoryId, false);

        $modifiedCategories = ['optgroup' => $categories['items']];

        $this->modifyKeys($modifiedCategories['optgroup']);

        return $modifiedCategories;
    }

    public function modifyKeys(array &$categories): void
    {
        foreach ($categories as &$category) {
            $category['value'] = $category['id'];
            unset($category['id']);
            unset($category['hasChildren']);

            if (isset($category['subcategories'])) {
                $category['optgroup'] = $category['subcategories'];
                unset($category['subcategories']);

                $this->modifyKeys($category['optgroup']);
            }
        }
    }
}
