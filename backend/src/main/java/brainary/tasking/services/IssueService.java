package brainary.tasking.services;

import java.util.Objects;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entities.IssueEntity;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.repositories.IssueRepository;
import brainary.tasking.schemas.IssueSchema;

@Service
public class IssueService {
    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IssueRepository issueRepository;

    public IssueSchema create(IssueSchema issueSchema) {
        if (issueRepository.existsById(issueSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("issue.conflict", null, LocaleContextHolder.getLocale()));
        }
        return modelMapper.map(issueRepository.save(modelMapper.map(issueSchema, IssueEntity.class)), IssueSchema.class);
    }

    public IssueSchema deleteById(Integer issueId) {
        IssueSchema issueSchema = findById(issueId);
        issueRepository.deleteById(issueId);
        return issueSchema;
    }

    public Page<IssueSchema> findAll(Pageable pageable) {
        return issueRepository.findAll(pageable).map(issueEntity -> modelMapper.map(issueEntity, IssueSchema.class));
    }

    public IssueSchema findById(Integer issueId) {
        return modelMapper.map(issueRepository.findById(issueId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("issue.not-found", null, LocaleContextHolder.getLocale()))), IssueSchema.class);
    }

    public ChangelogPayload<IssueSchema> update(IssueSchema newIssueSchema) {
        IssueSchema oldIssueSchema = findById(newIssueSchema.getId());
        BeanUtils.copyProperties(oldIssueSchema, newIssueSchema,
            Stream.of(BeanUtils.getPropertyDescriptors(IssueSchema.class)).filter(descriptor -> {
                try {
                    return !Objects.isNull(descriptor.getReadMethod().invoke(newIssueSchema));
                } catch (Exception exception) {
                    return true;
                }
            }).map(descriptor -> descriptor.getName()).toArray(String[]::new));
        issueRepository.save(modelMapper.map(newIssueSchema, IssueEntity.class));
        return ChangelogPayload.<IssueSchema>builder()
            .before(oldIssueSchema)
            .after(newIssueSchema)
            .build();
    }

}
