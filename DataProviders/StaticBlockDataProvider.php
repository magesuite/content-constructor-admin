<?php

namespace MageSuite\ContentConstructorAdmin\DataProviders;

class StaticBlockDataProvider implements \MageSuite\ContentConstructor\Components\StaticBlock\DataProvider
{

    /**
     * @var \Magento\Cms\Api\BlockRepositoryInterface
     */
    private $blockRepository;
    /**
     * @var \Magento\Framework\Api\SearchCriteriaBuilder
     */
    private $searchCriteriaBuilder;

    public function __construct(
        \Magento\Cms\Api\BlockRepositoryInterface $blockRepository,
        \Magento\Framework\Api\SearchCriteriaBuilder $searchCriteriaBuilder
    )
    {
        $this->blockRepository = $blockRepository;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
    }

    public function getBlocks()
    {
        $blocks = $this->getBlocksFromRepository();

        $return = [];

        foreach($blocks as $block) {
            $return[] = [
                'identifier' => $block['identifier'],
                'title' => $block['title']
            ];
        }

        return $return;
    }

    /**
     * @return \Magento\Cms\Api\Data\BlockInterface[]
     */
    public function getBlocksFromRepository()
    {
        $searchCriteria = $this->searchCriteriaBuilder->create();

        return $this->blockRepository->getList($searchCriteria)->getItems();
    }
}
