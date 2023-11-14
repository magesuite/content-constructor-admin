<?php

namespace MageSuite\ContentConstructorAdmin\DataProviders;

class CmsTeaserAdminDataProvider implements \MageSuite\ContentConstructor\Components\CmsTeaser\CmsTeaserAdminDataProvider
{
    /**
     * @var \MageSuite\CmsTagManager\Api\TagsRepositoryInterface
     */
    private $tagsRepository;

    public function __construct(\MageSuite\CmsTagManager\Api\TagsRepositoryInterface $tagsRepository)
    {
        $this->tagsRepository = $tagsRepository;
    }

    public function getTags() {
        $tags = [];

        $allTags = $this->tagsRepository->getAllTags();

        foreach ($allTags as $tag) {
            $tags[] = [
                'label' => $tag,
                'value' => $tag,
                'is_active' => '1'
            ];
        }

        $data = [];
        $data['optgroup'] = $tags;

        return $data;
    }

}
