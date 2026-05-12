<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\DataProviders;

class CategoryPickerDataProvider
{
    public function __construct(
        protected \Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository,
        protected \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory $categoryCollectionFactory,
        protected \Magento\Store\Model\StoreManagerInterface $storeManager,
        protected \MageSuite\ContentConstructorFrontend\Helper\Configuration $frontendConfiguration
    ) {
    }

    public function getCategories(int $rootCategoryId): array
    {
        $rootCategory = $this->categoryRepository->get($rootCategoryId);

        $collection = $this->categoryCollectionFactory->create();
        $collection->setStoreId((int) $this->storeManager->getStore()->getId());
        $collection->addAttributeToSelect(['name', 'is_active']);
        $collection->addAttributeToFilter('is_active', 1);
        $collection->addFieldToFilter('path', ['like' => $rootCategory->getPath() . '/%']);
        $collection->setOrder('level', \Magento\Framework\Data\Collection::SORT_ORDER_ASC);
        $collection->setOrder('position', \Magento\Framework\Data\Collection::SORT_ORDER_ASC);

        $nodesById = [];
        $childrenByParent = [];

        foreach ($collection as $category) {
            $id = (int) $category->getId();
            $parentId = (int) $category->getParentId();

            $nodesById[$id] = [
                'value' => (string) $id,
                'label' => (string) $category->getName(),
                'is_active' => (string) ((int) $category->getIsActive()),
            ];

            $childrenByParent[$parentId][] = $id;
        }

        if ($this->frontendConfiguration->isSortAlphabeticallyEnabled()) {
            foreach ($childrenByParent as &$childIds) {
                usort($childIds, function (int $a, int $b) use ($nodesById): int {
                    return strnatcasecmp(
                        $nodesById[$a]['label'] ?? '',
                        $nodesById[$b]['label'] ?? ''
                    );
                });
            }
            unset($childIds);
        }

        return ['optgroup' => $this->buildTree($rootCategoryId, $nodesById, $childrenByParent)];
    }

    protected function buildTree(int $parentId, array &$nodesById, array &$childrenByParent): array
    {
        if (empty($childrenByParent[$parentId])) {
            return [];
        }

        $result = [];

        foreach ($childrenByParent[$parentId] as $childId) {
            if (!isset($nodesById[$childId])) {
                continue;
            }

            $node = $nodesById[$childId];
            $children = $this->buildTree($childId, $nodesById, $childrenByParent);

            if (!empty($children)) {
                $node['optgroup'] = $children;
            }

            $result[] = $node;
        }

        return $result;
    }
}
